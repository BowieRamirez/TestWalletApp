import { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

interface TokenStorage {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  setAccessToken(token: string): void;
  setRefreshToken(token: string): void;
  clearTokens(): void;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken?: string;
}

let tokenStorage: TokenStorage | null = null;
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

export function setTokenStorage(storage: TokenStorage): void {
  tokenStorage = storage;
}

function getTokenStorage(): TokenStorage {
  if (!tokenStorage) {
    throw new Error('Token storage not configured. Call setTokenStorage() first.');
  }
  return tokenStorage;
}

function subscribeTokenRefresh(callback: (token: string) => void): void {
  refreshSubscribers.push(callback);
}

function onTokenRefreshed(newToken: string): void {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

async function refreshAccessToken(baseURL: string): Promise<string> {
  const storage = getTokenStorage();
  const refreshToken = storage.getRefreshToken();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${baseURL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    storage.clearTokens();
    throw new Error('Token refresh failed');
  }

  const data: RefreshResponse = await response.json();

  storage.setAccessToken(data.accessToken);
  if (data.refreshToken) {
    storage.setRefreshToken(data.refreshToken);
  }

  return data.accessToken;
}

export function authRequestInterceptor(
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig {
  const storage = getTokenStorage();
  const token = storage.getAccessToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

export function createAuthResponseInterceptor(baseURL: string) {
  return async (error: AxiosError): Promise<unknown> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            resolve(error.config?.axios?.request(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken(baseURL);
        isRefreshing = false;
        onTokenRefreshed(newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return error.config?.axios?.request(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        getTokenStorage().clearTokens();

        window?.dispatchEvent(new CustomEvent('auth:session-expired'));

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  };
}

export function applyAuthInterceptors(
  client: {
    interceptors: {
      request: {
        use: (
          onFulfilled: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig,
          onRejected?: (error: unknown) => Promise<never>
        ) => number;
      };
      response: {
        use: (
          onFulfilled: (response: unknown) => unknown,
          onRejected: (error: AxiosError) => Promise<unknown>
        ) => number;
      };
    };
    defaults: { baseURL?: string };
  }
): void {
  client.interceptors.request.use(authRequestInterceptor, (error) => Promise.reject(error));

  const baseURL = client.defaults.baseURL || '';
  client.interceptors.response.use(
    (response) => response,
    createAuthResponseInterceptor(baseURL)
  );
}

export type { TokenStorage, RefreshResponse };
