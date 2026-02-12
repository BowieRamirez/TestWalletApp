import { useAuthStore } from '../model/store';
import { refreshToken, refreshTokenWithToken } from '../api/refresh-token';
import { getSecureItem, deleteSecureItem } from '@banking/security';

// Buffer time before token expires to trigger refresh (5 minutes)
const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000;

// Refresh check interval (1 minute)
const REFRESH_CHECK_INTERVAL = 60 * 1000;

let refreshTimer: NodeJS.Timeout | null = null;

/**
 * Check if the current session is valid
 * Returns true if user is authenticated and token is not expired
 */
export function checkSessionValidity(): boolean {
  const state = useAuthStore.getState();

  if (!state.isAuthenticated || !state.tokens) {
    return false;
  }

  return !isTokenExpired(state.tokens.expiresAt);
}

/**
 * Check if token is expired or about to expire
 */
export function isTokenExpired(expiresAt: number, buffer: number = TOKEN_REFRESH_BUFFER): boolean {
  const now = Date.now();
  return now >= expiresAt - buffer;
}

/**
 * Handle session expiration
 * Clears auth state and redirects to login
 */
export async function handleSessionExpiration(): Promise<void> {
  // Clear auth state
  useAuthStore.getState().clearAuth();

  // Clear secure storage
  await deleteSecureItem('auth_token');
  await deleteSecureItem('refresh_token');

  // Clear any scheduled refresh
  clearScheduledTokenRefresh();

  // TODO: Navigate to login screen
  // This should be handled by navigation logic in the app
  console.log('Session expired. Redirecting to login...');
}

/**
 * Schedule automatic token refresh
 * Should be called after successful login
 */
export function scheduleTokenRefresh(): void {
  // Clear any existing timer
  clearScheduledTokenRefresh();

  // Set up periodic check
  refreshTimer = setInterval(async () => {
    await performTokenRefreshIfNeeded();
  }, REFRESH_CHECK_INTERVAL);
}

/**
 * Clear scheduled token refresh
 * Should be called on logout
 */
export function clearScheduledTokenRefresh(): void {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
}

/**
 * Perform token refresh if needed
 * Returns true if refresh was successful, false otherwise
 */
export async function performTokenRefreshIfNeeded(): Promise<boolean> {
  const state = useAuthStore.getState();

  if (!state.isAuthenticated || !state.tokens) {
    return false;
  }

  // Check if token needs refresh
  if (!isTokenExpired(state.tokens.expiresAt)) {
    return true; // Token still valid
  }

  try {
    const newTokens = await refreshToken();

    if (newTokens) {
      useAuthStore.getState().setTokens(newTokens);
      return true;
    }

    // Refresh failed, session expired
    await handleSessionExpiration();
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    await handleSessionExpiration();
    return false;
  }
}

/**
 * Force immediate token refresh
 * Useful when receiving 401 errors
 */
export async function forceTokenRefresh(): Promise<boolean> {
  try {
    const refreshTokenValue = await getSecureItem('refresh_token');

    if (!refreshTokenValue) {
      await handleSessionExpiration();
      return false;
    }

    const newTokens = await refreshTokenWithToken(refreshTokenValue);
    useAuthStore.getState().setTokens(newTokens);
    return true;
  } catch (error) {
    console.error('Force token refresh failed:', error);
    await handleSessionExpiration();
    return false;
  }
}

/**
 * Get time until token expiration in milliseconds
 * Returns 0 if token is already expired
 */
export function getTimeUntilExpiration(): number {
  const state = useAuthStore.getState();

  if (!state.tokens) {
    return 0;
  }

  const now = Date.now();
  const timeLeft = state.tokens.expiresAt - now;

  return Math.max(0, timeLeft);
}

/**
 * Initialize session manager
 * Should be called on app startup
 */
export async function initializeSession(): Promise<boolean> {
  const refreshTokenValue = await getSecureItem('refresh_token');

  if (!refreshTokenValue) {
    return false;
  }

  try {
    // Try to refresh token on startup
    const newTokens = await refreshTokenWithToken(refreshTokenValue);
    useAuthStore.getState().setTokens(newTokens);
    scheduleTokenRefresh();
    return true;
  } catch (error) {
    console.error('Failed to restore session:', error);
    await handleSessionExpiration();
    return false;
  }
}
