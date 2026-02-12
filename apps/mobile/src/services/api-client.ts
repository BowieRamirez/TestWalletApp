import axios from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "https://api.mybank.example.com/v1";

/**
 * Axios instance pre-configured for the MyBank API.
 * Includes auth token injection and response error handling.
 */
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor: attach auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // SecureStore not available (e.g., web) — skip
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // TODO: Attempt token refresh or force logout
      // const refreshToken = await SecureStore.getItemAsync('refresh_token');
      // if (refreshToken) { ... }
    }

    return Promise.reject(error);
  }
);
