/**
 * useBiometric Hook
 *
 * React hook for biometric authentication with hardware availability checking
 */

import { useState, useEffect, useCallback } from 'react';
import {
  BiometricAuth,
  BiometricType,
  BiometricAuthResult,
  BiometricHardwareInfo,
  biometricAuth,
} from '@banking/security';

export interface UseBiometricReturn {
  /** Whether biometric authentication is available on this device */
  isAvailable: boolean;
  /** The type of biometric available (fingerprint, facial-recognition, etc.) */
  biometricType: BiometricType | null;
  /** All supported biometric types on this device */
  supportedTypes: BiometricType[];
  /** Whether hardware check is in progress */
  isChecking: boolean;
  /** Whether an authentication is in progress */
  isAuthenticating: boolean;
  /** Error from the last operation, if any */
  error: Error | null;
  /** Detailed hardware information */
  hardwareInfo: BiometricHardwareInfo | null;
  /** Trigger biometric authentication */
  authenticate: (promptMessage?: string, fallbackLabel?: string) => Promise<BiometricAuthResult>;
  /** Check hardware availability */
  checkAvailability: () => Promise<void>;
  /** Clear any error state */
  clearError: () => void;
}

/**
 * Hook for biometric authentication
 *
 * @param customAuth - Optional custom BiometricAuth instance
 * @returns Biometric state and authentication function
 *
 * @example
 * function LoginScreen() {
 *   const {
 *     isAvailable,
 *     biometricType,
 *     authenticate,
 *     isAuthenticating,
 *     error,
 *   } = useBiometric();
 *
 *   const handleBiometricLogin = async () => {
 *     const result = await authenticate('Login with biometrics');
 *     if (result.success) {
 *       // User authenticated successfully
 *       navigateToDashboard();
 *     }
 *   };
 *
 *   if (!isAvailable) {
 *     return <Text>Biometric authentication not available</Text>;
 *   }
 *
 *   return (
 *     <View>
 *       <Button
 *         title={`Login with ${biometricType}`}
 *         onPress={handleBiometricLogin}
 *         disabled={isAuthenticating}
 *       />
 *       {error && <Text>Error: {error.message}</Text>}
 *     </View>
 *   );
 * }
 */
export function useBiometric(customAuth?: BiometricAuth): UseBiometricReturn {
  const auth = customAuth || biometricAuth;
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<BiometricType | null>(null);
  const [supportedTypes, setSupportedTypes] = useState<BiometricType[]>([]);
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hardwareInfo, setHardwareInfo] = useState<BiometricHardwareInfo | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const checkAvailability = useCallback(async () => {
    setIsChecking(true);
    setError(null);

    try {
      const info = await auth.checkHardware();
      setHardwareInfo(info);
      setIsAvailable(info.isAvailable);
      setSupportedTypes(info.supportedTypes);

      // Set primary biometric type (prefer facial recognition, then fingerprint)
      if (info.supportedTypes.includes('facial-recognition')) {
        setBiometricType('facial-recognition');
      } else if (info.supportedTypes.includes('fingerprint')) {
        setBiometricType('fingerprint');
      } else if (info.supportedTypes.includes('iris')) {
        setBiometricType('iris');
      } else if (info.supportedTypes.length > 0) {
        setBiometricType(info.supportedTypes[0]);
      } else {
        setBiometricType(null);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to check biometric hardware');
      setError(error);
      setIsAvailable(false);
      setBiometricType(null);
      setSupportedTypes([]);
    } finally {
      setIsChecking(false);
    }
  }, [auth]);

  const authenticate = useCallback(
    async (
      promptMessage?: string,
      fallbackLabel?: string
    ): Promise<BiometricAuthResult> => {
      setIsAuthenticating(true);
      setError(null);

      try {
        const result = await auth.authenticate(promptMessage, fallbackLabel);

        if (!result.success && result.error) {
          setError(new Error(result.error));
        }

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Authentication failed');
        setError(error);
        return {
          success: false,
          error: error.message,
        };
      } finally {
        setIsAuthenticating(false);
      }
    },
    [auth]
  );

  // Check hardware availability on mount
  useEffect(() => {
    checkAvailability();
  }, [checkAvailability]);

  return {
    isAvailable,
    biometricType,
    supportedTypes,
    isChecking,
    isAuthenticating,
    error,
    hardwareInfo,
    authenticate,
    checkAvailability,
    clearError,
  };
}

/**
 * Hook to get a user-friendly label for the biometric type
 *
 * @param biometricType - The biometric type
 * @returns User-friendly label (e.g., "Face ID", "Touch ID")
 */
export function useBiometricLabel(biometricType: BiometricType | null): string {
  switch (biometricType) {
    case 'facial-recognition':
      return 'Face ID';
    case 'fingerprint':
      return 'Touch ID';
    case 'iris':
      return 'Iris Scan';
    case 'none':
      return 'Biometric Authentication';
    default:
      return 'Biometric Authentication';
  }
}

/**
 * Hook to check if biometric authentication is enrolled and ready
 *
 * @returns Whether biometrics can be used for authentication
 */
export function useIsBiometricReady(): boolean {
  const { isAvailable, isChecking } = useBiometric();
  return isAvailable && !isChecking;
}
