import { MMKV, Configuration } from 'react-native-mmkv';
import { getSecureItem, setSecureItem, deleteSecureItem } from './secure-storage';

export interface EncryptedMMKVOptions {
  id: string;
  encryptionKey?: string;
  encryptionKeyStorageKey?: string;
}

/**
 * MMKV storage with encryption support
 * Used for encrypted cache storage of non-sensitive data
 */
export class EncryptedMMKVStorage {
  private instance: MMKV | null = null;
  private options: EncryptedMMKVOptions;
  private encryptionKeyStorageKey: string;

  constructor(options: EncryptedMMKVOptions) {
    this.options = {
      encryptionKeyStorageKey: `mmkv_key_${options.id}`,
      ...options,
    };
    this.encryptionKeyStorageKey = this.options.encryptionKeyStorageKey!;
  }

  /**
   * Initialize the MMKV instance with encryption
   */
  async initialize(): Promise<void> {
    let encryptionKey = this.options.encryptionKey;

    if (!encryptionKey) {
      // Try to retrieve existing key from secure storage
      const storedKey = await getSecureItem(this.encryptionKeyStorageKey as any);

      if (storedKey) {
        encryptionKey = storedKey;
      } else {
        // Generate new encryption key
        encryptionKey = this.generateEncryptionKey();
        await setSecureItem(this.encryptionKeyStorageKey as any, encryptionKey);
      }
    }

    const config: Configuration = {
      id: this.options.id,
      encryptionKey,
    };

    this.instance = new MMKV(config);
  }

  /**
   * Generate a random encryption key
   */
  private generateEncryptionKey(): string {
    const array = new Uint8Array(32);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      // Fallback for environments without crypto
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Get the MMKV instance (must call initialize first)
   */
  getInstance(): MMKV {
    if (!this.instance) {
      throw new Error('MMKV not initialized. Call initialize() first.');
    }
    return this.instance;
  }

  /**
   * Set a string value
   */
  set(key: string, value: string): void {
    this.getInstance().set(key, value);
  }

  /**
   * Get a string value
   */
  getString(key: string): string | undefined {
    return this.getInstance().getString(key);
  }

  /**
   * Set a number value
   */
  setNumber(key: string, value: number): void {
    this.getInstance().set(key, value);
  }

  /**
   * Get a number value
   */
  getNumber(key: string): number | undefined {
    return this.getInstance().getNumber(key);
  }

  /**
   * Set a boolean value
   */
  setBool(key: string, value: boolean): void {
    this.getInstance().set(key, value);
  }

  /**
   * Get a boolean value
   */
  getBool(key: string): boolean | undefined {
    return this.getInstance().getBoolean(key);
  }

  /**
   * Store an object as JSON
   */
  setObject<T>(key: string, value: T): void {
    this.getInstance().set(key, JSON.stringify(value));
  }

  /**
   * Get an object from JSON
   */
  getObject<T>(key: string): T | undefined {
    const json = this.getInstance().getString(key);
    if (!json) return undefined;
    try {
      return JSON.parse(json) as T;
    } catch {
      return undefined;
    }
  }

  /**
   * Check if a key exists
   */
  contains(key: string): boolean {
    return this.getInstance().contains(key);
  }

  /**
   * Delete a key
   */
  delete(key: string): void {
    this.getInstance().delete(key);
  }

  /**
   * Get all keys
   */
  getAllKeys(): string[] {
    return this.getInstance().getAllKeys();
  }

  /**
   * Clear all data
   */
  clearAll(): void {
    this.getInstance().clearAll();
  }

  /**
   * Clear all data and remove encryption key
   */
  async destroy(): Promise<void> {
    this.clearAll();
    await deleteSecureItem(this.encryptionKeyStorageKey as any);
    this.instance = null;
  }
}

// Pre-configured instances for common use cases

/**
 * Cache storage for app data
 */
export const cacheStorage = new EncryptedMMKVStorage({
  id: 'cache-storage',
});

/**
 * User preferences storage
 */
export const preferencesStorage = new EncryptedMMKVStorage({
  id: 'preferences-storage',
});

/**
 * Session cache storage
 */
export const sessionCacheStorage = new EncryptedMMKVStorage({
  id: 'session-cache-storage',
});
