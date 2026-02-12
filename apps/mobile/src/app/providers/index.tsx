import React, { ReactNode } from 'react';
import { QueryProvider } from './query-provider';
import { AuthProvider } from './auth-provider';
import { SecurityProvider } from './security-provider';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * AppProviders - Composes all application providers in the correct order
 *
 * Provider Order (important for dependencies):
 * 1. QueryProvider - TanStack Query with persistence (no dependencies)
 * 2. AuthProvider - Authentication state (depends on QueryProvider for API calls)
 * 3. SecurityProvider - Security features (depends on AuthProvider for logout)
 *
 * This ensures that:
 * - QueryClient is available for API calls
 * - Auth state is available for security features
 * - Security features can trigger auth actions (logout)
 */
export function AppProviders({ children }: AppProvidersProps): JSX.Element {
  return (
    <QueryProvider>
      <AuthProvider>
        <SecurityProvider>{children}</SecurityProvider>
      </AuthProvider>
    </QueryProvider>
  );
}

// Re-export individual providers for flexible composition
export { QueryProvider } from './query-provider';
export { AuthProvider, useAuth } from './auth-provider';
export { SecurityProvider } from './security-provider';

export default AppProviders;
