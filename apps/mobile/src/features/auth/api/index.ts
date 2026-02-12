/**
 * Auth API
 *
 * API endpoints and methods for authentication
 */

// Login
export {
  login,
  loginWithBiometrics,
  type LoginCredentials,
  type LoginResult,
} from './login';

// Logout
export {
  logout,
  logoutAllDevices,
  type LogoutResponse,
} from './logout';

// Refresh Token
export {
  refreshToken,
  refreshTokenWithToken,
  type RefreshTokenRequest,
  type RefreshTokenResponse,
} from './refresh-token';
