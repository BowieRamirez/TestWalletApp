import { axiosClient } from '@banking/api';
import { setSecureItem, getSecureItem } from '@banking/security';
import type { ApiResponse } from '@banking/api';
import type { AuthTokens } from '../model/types';

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Refresh access token using refresh token
 * POST /auth/refresh
 */
export async function refreshToken(): Promise<AuthTokens | null> {
  // Get refresh token from secure storage
  const storedRefreshToken = await getSecureItem('refresh_token');

  if (!storedRefreshToken) {
    throw new Error('No refresh token available');
  }

  const request: RefreshTokenRequest = {
    refreshToken: storedRefreshToken,
  };

  const response = await axiosClient.post<ApiResponse<RefreshTokenResponse>>(
    '/auth/refresh',
    request
  );

  const { accessToken, refreshToken, expiresIn } = response.data.data;

  // Calculate new expiration timestamp
  const expiresAt = Date.now() + expiresIn * 1000;

  const tokens: AuthTokens = {
    accessToken,
    refreshToken,
    expiresAt,
  };

  // Update tokens in secure storage
  await setSecureItem('auth_token', accessToken);
  await setSecureItem('refresh_token', refreshToken);

  return tokens;
}

/**
 * Refresh token with explicit token (used by interceptors)
 */
export async function refreshTokenWithToken(
  token: string
): Promise<AuthTokens> {
  const request: RefreshTokenRequest = {
    refreshToken: token,
  };

  const response = await axiosClient.post<ApiResponse<RefreshTokenResponse>>(
    '/auth/refresh',
    request
  );

  const { accessToken, refreshToken, expiresIn } = response.data.data;

  const expiresAt = Date.now() + expiresIn * 1000;

  const tokens: AuthTokens = {
    accessToken,
    refreshToken,
    expiresAt,
  };

  // Update tokens in secure storage
  await setSecureItem('auth_token', accessToken);
  await setSecureItem('refresh_token', refreshToken);

  return tokens;
}
