import * as SecureStore from 'expo-secure-store';

export type SecureStorageKey =
  | 'auth_token'
  | 'refresh_token'
  | 'user_pin'
  | 'biometric_enabled'
  | 'encryption_key'
  | 'session_data';

export interface SecureStorageOptions {
  keychainService?: string;
  keychainAccessible?: SecureStore.KeychainAccessibility;
}

const DEFAULT_OPTIONS: SecureStorageOptions = {
  keychainService: 'com.banking.secure',
  keychainAccessible: SecureStore.WHEN_UNLOCKED,
};

/**
 * Secure storage wrapper using expo-secure-store
 * Stores sensitive data like tokens, PIN, and encryption keys
 */
export class SecureStorage {
  private options: SecureStorageOptions;

  constructor(options: SecureStorageOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Store an item securely
   */
  async setItem(key: SecureStorageKey, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value, {
        keychainService: this.options.keychainService,
        keychainAccessible: this.options.keychainAccessible,
      });
    } catch (error) {
      throw new Error(`Failed to store item "${key}": ${error}`);
    }
  }

  /**
   * Retrieve an item from secure storage
   */
  async getItem(key: SecureStorageKey): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key, {
        keychainService: this.options.keychainService,
      });
    } catch (error) {
      throw new Error(`Failed to retrieve item "${key}": ${error}`);
    }
  }

  /**
   * Delete an item from secure storage
   */
  async deleteItem(key: SecureStorageKey): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key, {
        keychainService: this.options.keychainService,
      });
    } catch (error) {
      throw new Error(`Failed to delete item "${key}": ${error}`);
    }
  }

  /**
   * Check if secure storage is available on this device
   */
  async isAvailableAsync(): Promise<boolean> {
    return await SecureStore.isAvailableAsync();
  }
}

// Singleton instance for convenience
export const secureStorage = new SecureStorage();

// Convenience functions using singleton
export const setSecureItem = (key: SecureStorageKey, value: string): Promise<void> =>
  secureStorage.setItem(key, value);

export const getSecureItem = (key: SecureStorageKey): Promise<string | null> =>
  secureStorage.getItem(key);

export const deleteSecureItem = (key: SecureStorageKey): Promise<void> =>
  secureStorage.deleteItem(key);
