import { axiosClient } from '@banking/api';
import { setSecureItem } from '@banking/security';
import type { LoginRequest, LoginResponse, ApiResponse } from '@banking/api';
import type { User, AuthTokens } from '../model/types';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResult {
  user: User;
  tokens: AuthTokens;
}

/**
 * Login user with credentials
 * POST /auth/login
 */
export async function login(credentials: LoginCredentials): Promise<LoginResult> {
  const request: LoginRequest = {
    email: credentials.email,
    password: credentials.password,
    rememberMe: credentials.rememberMe ?? false,
  };

  const response = await axiosClient.post<ApiResponse<LoginResponse>>(
    '/auth/login',
    request
  );

  const { user, accessToken, refreshToken, expiresIn } = response.data.data;

  // Calculate expiration timestamp
  const expiresAt = Date.now() + expiresIn * 1000;

  const tokens: AuthTokens = {
    accessToken,
    refreshToken,
    expiresAt,
  };

  // Store tokens in secure storage
  await setSecureItem('auth_token', accessToken);
  await setSecureItem('refresh_token', refreshToken);

  // Transform API user to auth user (subset of fields)
  const authUser: User = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  return {
    user: authUser,
    tokens,
  };
}

/**
 * Login with biometrics
 * Uses stored refresh token to re-authenticate
 */
export async function loginWithBiometrics(): Promise<LoginResult> {
  const response = await axiosClient.post<ApiResponse<LoginResponse>>(
    '/auth/login/biometric'
  );

  const { user, accessToken, refreshToken, expiresIn } = response.data.data;

  const expiresAt = Date.now() + expiresIn * 1000;

  const tokens: AuthTokens = {
    accessToken,
    refreshToken,
    expiresAt,
  };

  // Update secure storage
  await setSecureItem('auth_token', accessToken);
  await setSecureItem('refresh_token', refreshToken);

  const authUser: User = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  return {
    user: authUser,
    tokens,
  };
}
