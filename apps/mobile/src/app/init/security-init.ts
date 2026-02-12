import { Platform, NativeModules } from 'react-native';
import {
  secureStorage,
  encryption,
  cacheStorage,
  preferencesStorage,
} from '@banking/security';

/**
 * Security initialization options
 */
export interface SecurityInitOptions {
  /** Skip jailbreak/root detection (useful for development) */
  skipJailbreakCheck?: boolean;
  /** Skip secure storage initialization */
  skipSecureStorage?: boolean;
  /** Skip encryption key setup */
  skipEncryptionSetup?: boolean;
}

/**
 * Security initialization result
 */
export interface SecurityInitResult {
  /** Whether initialization was successful */
  success: boolean;
  /** Error if initialization failed */
  error?: Error;
  /** Security status details */
  details?: {
    jailbreakDetected: boolean;
    secureStorageAvailable: boolean;
    encryptionReady: boolean;
  };
}

/**
 * Check if the device is jailbroken (iOS) or rooted (Android)
 *
 * Note: This is a placeholder implementation. In production, you would:
 * - Use react-native-jailbreak-detection or similar library
 * - Implement native module checks for:
 *   - iOS: Cydia, suspicious files, write access to system directories
 *   - Android: Superuser APK, test-keys, writable system paths
 *
 * @returns Object with detection result and details
 */
async function checkJailbreakOrRoot(): Promise<{
  isCompromised: boolean;
  details: string[];
}> {
  const details: string[] = [];

  try {
    console.log('Checking for jailbreak/root...');

    // Placeholder: Check using native module if available
    // In production, use react-native-jailbreak-detection:
    // const JailbreakDetector = NativeModules.JailbreakDetector;
    // const isJailbroken = await JailbreakDetector?.isJailbroken?.();

    // Simulated checks (replace with actual implementation)
    if (Platform.OS === 'ios') {
      // iOS jailbreak indicators (placeholder)
      // - Check for Cydia app
      // - Check for suspicious files
      // - Check write access to system directories
      details.push('iOS jailbreak check: placeholder implementation');
    } else if (Platform.OS === 'android') {
      // Android root indicators (placeholder)
      // - Check for superuser APK
      // - Check build tags for test-keys
      // - Check for writable system paths
      details.push('Android root check: placeholder implementation');
    }

    // For development, assume device is not compromised
    // In production, implement actual detection logic
    const isCompromised = false;

    console.log('Jailbreak/root check completed:', { isCompromised, details });

    return { isCompromised, details };
  } catch (error) {
    console.error('Jailbreak/root check error:', error);
    // Fail secure: assume compromised if check fails
    return {
      isCompromised: true,
      details: ['Error during jailbreak/root detection'],
    };
  }
}

/**
 * Initialize secure storage
 *
 * Verifies that secure storage is available and working on the device.
 */
async function initializeSecureStorage(): Promise<boolean> {
  try {
    console.log('Initializing secure storage...');

    // Check if secure storage is available
    const isAvailable = await secureStorage.isAvailableAsync();

    if (!isAvailable) {
      console.error('Secure storage is not available on this device');
      return false;
    }

    // Test secure storage with a dummy value
    const testKey = 'test_key' as const;
    const testValue = 'test_value';

    await secureStorage.setItem(testKey, testValue);
    const retrievedValue = await secureStorage.getItem(testKey);
    await secureStorage.deleteItem(testKey);

    if (retrievedValue !== testValue) {
      console.error('Secure storage test failed');
      return false;
    }

    console.log('Secure storage initialized successfully');
    return true;
  } catch (error) {
    console.error('Secure storage initialization error:', error);
    return false;
  }
}

/**
 * Setup encryption keys and initialize encrypted storage
 *
 * This function:
 * 1. Generates or retrieves the master encryption key
 * 2. Initializes MMKV storage instances with encryption
 * 3. Verifies encryption is working
 */
async function setupEncryption(): Promise<boolean> {
  try {
    console.log('Setting up encryption...');

    // Generate or retrieve master encryption key
    const masterKeyName = 'master_encryption_key';
    let masterKey = await encryption.retrieveKey(masterKeyName);

    if (!masterKey) {
      console.log('Generating new master encryption key...');
      masterKey = await encryption.generateKey();
      await encryption.storeKey(masterKeyName, masterKey);
    } else {
      console.log('Retrieved existing master encryption key');
    }

    // Initialize MMKV storage instances with encryption
    await Promise.all([
      cacheStorage.initialize(),
      preferencesStorage.initialize(),
    ]);

    // Verify encryption is working
    const testData = 'sensitive_test_data';
    const encrypted = await encryption.encrypt(testData, masterKey);
    const decrypted = await encryption.decrypt(encrypted, masterKey);

    if (decrypted !== testData) {
      throw new Error('Encryption verification failed');
    }

    console.log('Encryption setup completed successfully');
    return true;
  } catch (error) {
    console.error('Encryption setup error:', error);
    return false;
  }
}

/**
 * Initialize security features
 *
 * This function handles all security initialization:
 * 1. Jailbreak/root detection
 * 2. Secure storage initialization
 * 3. Encryption key setup
 *
 * @param options - Security initialization options
 * @returns Promise resolving to initialization result
 *
 * @example
 * ```typescript
 * const result = await initializeSecurity();
 * if (!result.success) {
 *   // Handle security initialization failure
 *   Alert.alert('Security Error', 'Failed to initialize security features');
 * }
 * ```
 */
export async function initializeSecurity(
  options: SecurityInitOptions = {}
): Promise<SecurityInitResult> {
  const {
    skipJailbreakCheck = false,
    skipSecureStorage = false,
    skipEncryptionSetup = false,
  } = options;

  console.log('Starting security initialization...');

  try {
    // Step 1: Check for jailbreak/root
    let jailbreakDetected = false;
    if (!skipJailbreakCheck) {
      const jailbreakResult = await checkJailbreakOrRoot();
      jailbreakDetected = jailbreakResult.isCompromised;

      if (jailbreakDetected) {
        console.warn('Jailbreak/root detected:', jailbreakResult.details);
        // In production, you might want to:
        // - Show a warning to the user
        // - Limit app functionality
        // - Log the event for security monitoring
      }
    }

    // Step 2: Initialize secure storage
    let secureStorageAvailable = false;
    if (!skipSecureStorage) {
      secureStorageAvailable = await initializeSecureStorage();

      if (!secureStorageAvailable) {
        throw new Error('Secure storage initialization failed');
      }
    }

    // Step 3: Setup encryption
    let encryptionReady = false;
    if (!skipEncryptionSetup) {
      encryptionReady = await setupEncryption();

      if (!encryptionReady) {
        throw new Error('Encryption setup failed');
      }
    }

    console.log('Security initialization completed successfully');

    return {
      success: true,
      details: {
        jailbreakDetected,
        secureStorageAvailable,
        encryptionReady,
      },
    };
  } catch (error) {
    const initError = error instanceof Error
      ? error
      : new Error('Security initialization failed');

    console.error('Security initialization failed:', initError);

    return {
      success: false,
      error: initError,
      details: {
        jailbreakDetected: false,
        secureStorageAvailable: false,
        encryptionReady: false,
      },
    };
  }
}

/**
 * Get security status
 *
 * Returns the current security status of the app
 */
export async function getSecurityStatus(): Promise<{
  secureStorageAvailable: boolean;
  encryptionReady: boolean;
}> {
  const secureStorageAvailable = await secureStorage.isAvailableAsync();

  // Check if master key exists
  let encryptionReady = false;
  try {
    const masterKey = await encryption.retrieveKey('master_encryption_key');
    encryptionReady = masterKey !== null;
  } catch {
    encryptionReady = false;
  }

  return {
    secureStorageAvailable,
    encryptionReady,
  };
}

/**
 * Clear all secure data
 *
 * WARNING: This will delete all encrypted data including:
 * - Auth tokens
 * - User preferences
 * - Cached data
 */
export async function clearAllSecureData(): Promise<void> {
  try {
    console.log('Clearing all secure data...');

    // Clear MMKV storage
    cacheStorage.clearAll();
    preferencesStorage.clearAll();

    // Delete encryption keys
    await encryption.deleteKey('master_encryption_key');

    console.log('All secure data cleared');
  } catch (error) {
    console.error('Error clearing secure data:', error);
    throw error;
  }
}

export default initializeSecurity;
