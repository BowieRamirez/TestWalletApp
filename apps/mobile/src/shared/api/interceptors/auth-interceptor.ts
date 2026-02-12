/**
 * Authentication Interceptor
 *
 * Handles token management and authentication flows
 */

import { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { apiClient } from '../base-client';
import { ENV } from '../../config/env';

const AUTH_TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Public endpoints that don't require authentication
const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];

/**
 * Check if the request URL is a public endpoint
 */
const isPublicEndpoint = (url?: string): boolean => {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
};

/**
 * Get token from secure storage
 */
const getAuthToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
};

/**
 * Refresh the authentication token
 */
const refreshAuthToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    if (!refreshToken) return null;

    // Use a fresh axios instance to avoid interceptor loops
    const response = await fetch(`${ENV.API_BASE_URL}/${ENV.API_VERSION}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();

    if (data.token) {
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, data.token);
      if (data.refreshToken) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, data.refreshToken);
      }
      return data.token;
    }

    return null;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

/**
 * Clear authentication tokens
 */
const clearAuthTokens = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to clear auth tokens:', error);
  }
};

/**
 * Request interceptor - adds Authorization header
 */
export const authRequestInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  // Skip authentication for public endpoints
  if (isPublicEndpoint(config.url)) {
    return config;
  }

  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

/**
 * Response interceptor - handles 401 errors and token refresh
 */
export const authResponseInterceptor = async (error: AxiosError): Promise<AxiosResponse> => {
  const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

  // Handle 401 Unauthorized
  if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
      const newToken = await refreshAuthToken();

      if (newToken) {
        // Retry the original request with new token
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } else {
        // Token refresh failed, clear tokens and reject
        await clearAuthTokens();
        // TODO: Trigger logout action or navigation to login screen
      }
    } catch (refreshError) {
      await clearAuthTokens();
      // TODO: Trigger logout action or navigation to login screen
    }
  }

  return Promise.reject(error);
};
