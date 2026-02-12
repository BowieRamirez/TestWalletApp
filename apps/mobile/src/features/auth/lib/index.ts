/**
 * Auth Lib
 *
 * Utility functions and helpers for authentication
 */

export {
  checkSessionValidity,
  isTokenExpired,
  handleSessionExpiration,
  scheduleTokenRefresh,
  clearScheduledTokenRefresh,
  performTokenRefreshIfNeeded,
  forceTokenRefresh,
  getTimeUntilExpiration,
  initializeSession,
} from './session-manager';
