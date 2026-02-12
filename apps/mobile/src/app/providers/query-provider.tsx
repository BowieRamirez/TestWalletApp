import React, { ReactNode, useState } from 'react';
import { QueryClient, QueryClientConfig } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { MMKV } from 'react-native-mmkv';
import { cacheStorage } from '@banking/security';

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Default QueryClient configuration
 * Optimized for mobile banking app with appropriate stale times and retries
 */
const defaultQueryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 24 hours
      gcTime: 24 * 60 * 60 * 1000,
      // Retry failed requests 2 times with exponential backoff
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus (app foreground) for mobile
      refetchOnWindowFocus: true,
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      retryDelay: 1000,
    },
  },
};

/**
 * Custom storage adapter for MMKV to work with TanStack Query persister
 */
function createMMKVStorageAdapter(mmkv: MMKV) {
  return {
    getItem: (key: string): string | null => {
      try {
        return mmkv.getString(key) ?? null;
      } catch (error) {
        console.error(`Error reading from MMKV: ${key}`, error);
        return null;
      }
    },
    setItem: (key: string, value: string): void => {
      try {
        mmkv.set(key, value);
      } catch (error) {
        console.error(`Error writing to MMKV: ${key}`, error);
      }
    },
    removeItem: (key: string): void => {
      try {
        mmkv.delete(key);
      } catch (error) {
        console.error(`Error deleting from MMKV: ${key}`, error);
      }
    },
  };
}

/**
 * QueryProvider - TanStack Query provider with MMKV persistence
 *
 * Features:
 * - QueryClient with optimized defaults for mobile banking
 * - Persistent cache using MMKV storage
 * - Automatic cache hydration on app start
 */
export function QueryProvider({ children }: QueryProviderProps): JSX.Element {
  const [queryClient] = useState(() => new QueryClient(defaultQueryClientConfig));
  const [persister] = useState(() => {
    // Ensure cache storage is initialized
    const mmkv = cacheStorage.getInstance();
    const storage = createMMKVStorageAdapter(mmkv);

    return createSyncStoragePersister({
      storage,
      key: 'banking-query-cache',
      // Throttle persisting to avoid excessive writes
      throttleTime: 1000,
      // Serialize/deserialize with error handling
      serialize: (data) => JSON.stringify(data),
      deserialize: (data) => {
        try {
          return JSON.parse(data);
        } catch {
          return undefined;
        }
      },
    });
  });

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        // Max age for persisted cache (24 hours)
        maxAge: 24 * 60 * 60 * 1000,
        // Buster key for cache invalidation on app updates
        buster: process.env.APP_VERSION || '1.0.0',
      }}
      onSuccess={() => {
        // Resume paused mutations after hydration
        queryClient.resumePausedMutations().catch((error) => {
          console.error('Error resuming paused mutations:', error);
        });
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}

export default QueryProvider;
