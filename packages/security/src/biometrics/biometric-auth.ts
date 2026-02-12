import * as LocalAuthentication from 'expo-local-authentication';

export type BiometricType = 'fingerprint' | 'facial-recognition' | 'iris' | 'none';

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  warning?: string;
}

export interface BiometricHardwareInfo {
  isAvailable: boolean;
  hasHardware: boolean;
  isEnrolled: boolean;
  supportedTypes: BiometricType[];
}

/**
 * Biometric authentication using expo-local-authentication
 * Supports FaceID, TouchID, fingerprint, and other biometric methods
 */
export class BiometricAuth {
  /**
   * Check if biometric hardware is available and enrolled
   */
  async checkHardware(): Promise<BiometricHardwareInfo> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

    const typeMap: Record<LocalAuthentication.AuthenticationType, BiometricType> = {
      [LocalAuthentication.AuthenticationType.FINGERPRINT]: 'fingerprint',
      [LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION]: 'facial-recognition',
      [LocalAuthentication.AuthenticationType.IRIS]: 'iris',
    };

    return {
      isAvailable: hasHardware && isEnrolled,
      hasHardware,
      isEnrolled,
      supportedTypes: supportedTypes.map((type) => typeMap[type] || 'none'),
    };
  }

  /**
   * Get a user-friendly label for the biometric type
   */
  async getBiometricLabel(): Promise<string> {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();

    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'Face ID';
    }
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'Touch ID';
    }
    if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 'Iris Scan';
    }
    return 'Biometric Authentication';
  }

  /**
   * Authenticate using biometrics
   */
  async authenticate(
    promptMessage: string = 'Authenticate to access your account',
    fallbackLabel: string = 'Use PIN'
  ): Promise<BiometricAuthResult> {
    try {
      const hardwareInfo = await this.checkHardware();

      if (!hardwareInfo.hasHardware) {
        return {
          success: false,
          error: 'Biometric hardware not available on this device',
        };
      }

      if (!hardwareInfo.isEnrolled) {
        return {
          success: false,
          error: 'No biometric credentials enrolled. Please set up biometrics in device settings.',
        };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel,
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
        requireConfirmation: true,
      });

      if (result.success) {
        return { success: true };
      }

      // Handle specific error cases
      switch (result.error) {
        case 'user_cancel':
          return { success: false, error: 'Authentication cancelled by user' };
        case 'system_cancel':
          return { success: false, error: 'Authentication cancelled by system' };
        case 'not_enrolled':
          return { success: false, error: 'Biometric not enrolled' };
        case 'not_available':
          return { success: false, error: 'Biometric not available' };
        case 'lockout':
          return {
            success: false,
            error: 'Too many failed attempts. Biometric authentication is locked.',
          };
        default:
          return {
            success: false,
            error: result.error || 'Authentication failed',
            warning: result.warning,
          };
      }
    } catch (error) {
      return {
        success: false,
        error: `Authentication error: ${error}`,
      };
    }
  }

  /**
   * Authenticate with security level requirement
   */
  async authenticateWithSecurityLevel(
    securityLevel: LocalAuthentication.SecurityLevel = LocalAuthentication.SecurityLevel.BIOMETRIC,
    promptMessage?: string
  ): Promise<BiometricAuthResult> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: promptMessage || 'Authenticate to continue',
        requireConfirmation: true,
        securityLevel,
      });

      if (result.success) {
        return { success: true };
      }

      return {
        success: false,
        error: result.error || 'Authentication failed',
        warning: result.warning,
      };
    } catch (error) {
      return {
        success: false,
        error: `Authentication error: ${error}`,
      };
    }
  }

  /**
   * Check if the device supports biometric authentication
   */
  async isSupported(): Promise<boolean> {
    const info = await this.checkHardware();
    return info.isAvailable;
  }

  /**
   * Check if Face ID is available
   */
  async hasFaceId(): Promise<boolean> {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    return types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
  }

  /**
   * Check if fingerprint/Touch ID is available
   */
  async hasFingerprint(): Promise<boolean> {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    return types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);
  }
}

// Singleton instance
export const biometricAuth = new BiometricAuth();

// Convenience functions
export const checkBiometricHardware = (): Promise<BiometricHardwareInfo> =>
  biometricAuth.checkHardware();

export const authenticateWithBiometric = (
  promptMessage?: string,
  fallbackLabel?: string
): Promise<BiometricAuthResult> => biometricAuth.authenticate(promptMessage, fallbackLabel);

export const isBiometricSupported = (): Promise<boolean> => biometricAuth.isSupported();
