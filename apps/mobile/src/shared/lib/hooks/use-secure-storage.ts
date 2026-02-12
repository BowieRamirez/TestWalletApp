/**
 * useSecureStorage Hook
 *
 * React hook for secure storage operations with loading and error states
 */

import { useState, useCallback, useEffect } from 'react';
import {
  SecureStorage,
  SecureStorageKey,
  secureStorage,
} from '@banking/security';

export interface UseSecureStorageReturn {
  /** Retrieve an item from secure storage */
  getItem: (key: SecureStorageKey) => Promise<string | null>;
  /** Store an item in secure storage */
  setItem: (key: SecureStorageKey, value: string) => Promise<void>;
  /** Remove an item from secure storage */
  removeItem: (key: SecureStorageKey) => Promise<void>;
  /** Whether an operation is in progress */
  loading: boolean;
  /** Error from the last operation, if any */
  error: Error | null;
  /** Clear the current error */
  clearError: () => void;
}

/**
 * Hook for secure storage operations
 *
 * @param customStorage - Optional custom SecureStorage instance
 * @returns Secure storage operations with loading and error states
 *
 * @example
 * function LoginComponent() {
 *   const { setItem, getItem, loading, error } = useSecureStorage();
 *
 *   const handleLogin = async (token: string) => {
 *     await setItem('auth_token', token);
 *   };
 *
 *   if (loading) return <Spinner />;
 *   if (error) return <Error message={error.message} />;
 *
 *   return <LoginForm onSubmit={handleLogin} />;
 * }
 */
export function useSecureStorage(
  customStorage?: SecureStorage
): UseSecureStorageReturn {
  const storage = customStorage || secureStorage;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getItem = useCallback(
    async (key: SecureStorageKey): Promise<string | null> => {
      setLoading(true);
      setError(null);

      try {
        const value = await storage.getItem(key);
        return value;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error(`Failed to get item: ${key}`);
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [storage]
  );

  const setItem = useCallback(
    async (key: SecureStorageKey, value: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await storage.setItem(key, value);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error(`Failed to set item: ${key}`);
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [storage]
  );

  const removeItem = useCallback(
    async (key: SecureStorageKey): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await storage.deleteItem(key);
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error(`Failed to remove item: ${key}`);
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [storage]
  );

  return {
    getItem,
    setItem,
    removeItem,
    loading,
    error,
    clearError,
  };
}

/**
 * Hook to retrieve and cache a secure storage value
 *
 * @param key - Storage key to retrieve
 * @returns Object with value, loading state, and error
 *
 * @example
 * function TokenDisplay() {
 *   const { value: token, loading, error } = useSecureStorageValue('auth_token');
 *
 *   if (loading) return <Text>Loading...</Text>;
 *   if (error) return <Text>Error: {error.message}</Text>;
 *   return <Text>Token: {token || 'Not set'}</Text>;
 * }
 */
export function useSecureStorageValue(key: SecureStorageKey): {
  value: string | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
} {
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { getItem } = useSecureStorage();

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getItem(key);
      setValue(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get value'));
    } finally {
      setLoading(false);
    }
  }, [getItem, key]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    value,
    loading,
    error,
    refresh,
  };
}
