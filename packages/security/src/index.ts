// Storage exports
export {
  SecureStorage,
  secureStorage,
  setSecureItem,
  getSecureItem,
  deleteSecureItem,
  type SecureStorageKey,
  type SecureStorageOptions,
} from './storage/secure-storage';

export {
  EncryptedMMKVStorage,
  cacheStorage,
  preferencesStorage,
  sessionCacheStorage,
  type EncryptedMMKVOptions,
} from './storage/mmkv-storage';

// Biometrics exports
export {
  BiometricAuth,
  biometricAuth,
  checkBiometricHardware,
  authenticateWithBiometric,
  isBiometricSupported,
  type BiometricType,
  type BiometricAuthResult,
  type BiometricHardwareInfo,
} from './biometrics/biometric-auth';

// Crypto exports
export {
  Encryption,
  encryption,
  encryptData,
  decryptData,
  encryptWithPassword,
  decryptWithPassword,
  ReactNativeAESCrypto,
  type EncryptedData,
  type KeyDerivationOptions,
} from './crypto/encryption';
