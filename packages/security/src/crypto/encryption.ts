import { getSecureItem, setSecureItem, deleteSecureItem } from '../storage/secure-storage';

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  salt: string;
  tag?: string;
}

export interface KeyDerivationOptions {
  iterations: number;
  keyLength: number;
  digest: string;
}

const DEFAULT_KDF_OPTIONS: KeyDerivationOptions = {
  iterations: 100000,
  keyLength: 32,
  digest: 'SHA-256',
};

/**
 * Encryption utilities using Web Crypto API
 * Provides AES-GCM encryption for sensitive data
 */
export class Encryption {
  private subtle: SubtleCrypto;

  constructor() {
    if (typeof crypto === 'undefined' || !crypto.subtle) {
      throw new Error('Web Crypto API not available');
    }
    this.subtle = crypto.subtle;
  }

  /**
   * Generate a random encryption key
   */
  async generateKey(): Promise<CryptoKey> {
    return await this.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true, // extractable
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Export a CryptoKey to raw bytes
   */
  async exportKey(key: CryptoKey): Promise<ArrayBuffer> {
    return await this.subtle.exportKey('raw', key);
  }

  /**
   * Import raw bytes as a CryptoKey
   */
  async importKey(keyData: ArrayBuffer): Promise<CryptoKey> {
    return await this.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Generate a random initialization vector
   */
  generateIV(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(12)); // 96 bits for GCM
  }

  /**
   * Generate random salt for key derivation
   */
  generateSalt(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(16));
  }

  /**
   * Derive an encryption key from a password using PBKDF2
   */
  async deriveKeyFromPassword(
    password: string,
    salt: Uint8Array,
    options: Partial<KeyDerivationOptions> = {}
  ): Promise<CryptoKey> {
    const opts = { ...DEFAULT_KDF_OPTIONS, ...options };

    // Import password as key material
    const passwordKey = await this.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    // Derive the actual encryption key
    return await this.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: opts.iterations,
        hash: opts.digest,
      },
      passwordKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt data using AES-GCM
   */
  async encrypt(
    plaintext: string,
    key: CryptoKey,
    iv?: Uint8Array
  ): Promise<EncryptedData> {
    const usedIv = iv || this.generateIV();

    const ciphertext = await this.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: usedIv,
      },
      key,
      new TextEncoder().encode(plaintext)
    );

    return {
      ciphertext: this.arrayBufferToBase64(ciphertext),
      iv: this.arrayBufferToBase64(usedIv),
      salt: '', // Not used for direct key encryption
    };
  }

  /**
   * Decrypt data using AES-GCM
   */
  async decrypt(encryptedData: EncryptedData, key: CryptoKey): Promise<string> {
    const ciphertext = this.base64ToArrayBuffer(encryptedData.ciphertext);
    const iv = this.base64ToArrayBuffer(encryptedData.iv);

    const plaintext = await this.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      ciphertext
    );

    return new TextDecoder().decode(plaintext);
  }

  /**
   * Encrypt data with password-derived key
   */
  async encryptWithPassword(
    plaintext: string,
    password: string
  ): Promise<EncryptedData> {
    const salt = this.generateSalt();
    const key = await this.deriveKeyFromPassword(password, salt);
    const iv = this.generateIV();

    const ciphertext = await this.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      new TextEncoder().encode(plaintext)
    );

    return {
      ciphertext: this.arrayBufferToBase64(ciphertext),
      iv: this.arrayBufferToBase64(iv),
      salt: this.arrayBufferToBase64(salt),
    };
  }

  /**
   * Decrypt data with password-derived key
   */
  async decryptWithPassword(
    encryptedData: EncryptedData,
    password: string
  ): Promise<string> {
    const salt = this.base64ToArrayBuffer(encryptedData.salt);
    const key = await this.deriveKeyFromPassword(password, new Uint8Array(salt));

    return await this.decrypt(encryptedData, key);
  }

  /**
   * Store an encryption key securely
   */
  async storeKey(keyName: string, key: CryptoKey): Promise<void> {
    const exported = await this.exportKey(key);
    const base64Key = this.arrayBufferToBase64(exported);
    await setSecureItem(keyName as any, base64Key);
  }

  /**
   * Retrieve a stored encryption key
   */
  async retrieveKey(keyName: string): Promise<CryptoKey | null> {
    const base64Key = await getSecureItem(keyName as any);
    if (!base64Key) return null;

    const keyData = this.base64ToArrayBuffer(base64Key);
    return await this.importKey(keyData);
  }

  /**
   * Delete a stored encryption key
   */
  async deleteKey(keyName: string): Promise<void> {
    await deleteSecureItem(keyName as any);
  }

  /**
   * Convert ArrayBuffer to base64 string
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Convert base64 string to ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

// Singleton instance
export const encryption = new Encryption();

// Convenience functions
export const encryptData = (plaintext: string, key: CryptoKey): Promise<EncryptedData> =>
  encryption.encrypt(plaintext, key);

export const decryptData = (encryptedData: EncryptedData, key: CryptoKey): Promise<string> =>
  encryption.decrypt(encryptedData, key);

export const encryptWithPassword = (plaintext: string, password: string): Promise<EncryptedData> =>
  encryption.encryptWithPassword(plaintext, password);

export const decryptWithPassword = (encryptedData: EncryptedData, password: string): Promise<string> =>
  encryption.decryptWithPassword(encryptedData, password);

/**
 * React Native AES Crypto pattern fallback utilities
 * These can be used when Web Crypto is not available (older RN versions)
 */
export class ReactNativeAESCrypto {
  /**
   * Generate a random key (placeholder for react-native-aes-crypto integration)
   */
  static async generateKey(): Promise<string> {
    // In actual implementation, this would use react-native-aes-crypto
    // Example: return await Aes.randomKey(32);
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Encrypt using AES pattern (placeholder)
   */
  static async encrypt(text: string, key: string, iv: string): Promise<string> {
    // In actual implementation:
    // return await Aes.encrypt(text, key, iv, 'aes-256-cbc');
    throw new Error('React Native AES Crypto not implemented. Use Web Crypto API instead.');
  }

  /**
   * Decrypt using AES pattern (placeholder)
   */
  static async decrypt(ciphertext: string, key: string, iv: string): Promise<string> {
    // In actual implementation:
    // return await Aes.decrypt(ciphertext, key, iv, 'aes-256-cbc');
    throw new Error('React Native AES Crypto not implemented. Use Web Crypto API instead.');
  }

  /**
   * Generate hash using SHA-256 pattern (placeholder)
   */
  static async sha256(text: string): Promise<string> {
    // In actual implementation:
    // return await Aes.sha256(text);
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
}
