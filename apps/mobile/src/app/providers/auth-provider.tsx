import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import {
  secureStorage,
  getSecureItem,
  setSecureItem,
  deleteSecureItem,
  biometricAuth,
  BiometricAuthResult,
} from '@banking/security';
import { setTokenStorage, User } from '@banking/api';

// Auth state types
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: Error | null;
}

interface AuthContextValue extends AuthState {
  // Auth methods
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  // Biometric methods
  authenticateWithBiometric: () => Promise<BiometricAuthResult>;
  isBiometricEnabled: () => Promise<boolean>;
  enableBiometric: (enabled: boolean) => Promise<void>;
  // Token storage for API client
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  clearTokens: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Initial auth state
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null,
};

// Create auth context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * AuthProvider - Manages authentication state and provides auth methods
 *
 * Features:
 * - Initialize auth state on mount (check for existing tokens)
 * - Provide login/logout functionality
 * - Integrate with biometric authentication
 * - Token management for API client
 */
export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [state, setState] = useState<AuthState>(initialState);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [refreshToken, setRefreshTokenState] = useState<string | null>(null);

  // Token storage methods for API client
  const getAccessToken = useCallback((): string | null => accessToken, [accessToken]);
  const getRefreshToken = useCallback((): string | null => refreshToken, [refreshToken]);

  const setAccessToken = useCallback((token: string): void => {
    setAccessTokenState(token);
    // Also store in secure storage for persistence
    setSecureItem('auth_token', token).catch((error) => {
      console.error('Failed to store access token:', error);
    });
  }, []);

  const setRefreshToken = useCallback((token: string): void => {
    setRefreshTokenState(token);
    setSecureItem('refresh_token', token).catch((error) => {
      console.error('Failed to store refresh token:', error);
    });
  }, []);

  const clearTokens = useCallback((): void => {
    setAccessTokenState(null);
    setRefreshTokenState(null);
    // Clear from secure storage
    Promise.all([
      deleteSecureItem('auth_token'),
      deleteSecureItem('refresh_token'),
    ]).catch((error) => {
      console.error('Failed to clear tokens:', error);
    });
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Check for existing tokens
        const [storedAccessToken, storedRefreshToken, storedUser] = await Promise.all([
          getSecureItem('auth_token'),
          getSecureItem('refresh_token'),
          getSecureItem('session_data'),
        ]);

        if (storedAccessToken && storedRefreshToken) {
          setAccessTokenState(storedAccessToken);
          setRefreshTokenState(storedRefreshToken);

          // Parse user data if available
          let user: User | null = null;
          if (storedUser) {
            try {
              user = JSON.parse(storedUser) as User;
            } catch {
              user = null;
            }
          }

          setState({
            isAuthenticated: true,
            isLoading: false,
            user,
            error: null,
          });
        } else {
          setState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            error: null,
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: error instanceof Error ? error : new Error('Failed to initialize auth'),
        });
      }
    };

    initializeAuth();
  }, []);

  // Configure token storage for API client
  useEffect(() => {
    setTokenStorage({
      getAccessToken,
      getRefreshToken,
      setAccessToken,
      setRefreshToken,
      clearTokens,
    });
  }, [getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, clearTokens]);

  // Login method
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // This would typically call your auth API
      // For now, this is a placeholder that should be replaced with actual API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      // Store tokens
      await Promise.all([
        setSecureItem('auth_token', data.accessToken),
        setSecureItem('refresh_token', data.refreshToken),
        setSecureItem('session_data', JSON.stringify(data.user)),
      ]);

      setAccessTokenState(data.accessToken);
      setRefreshTokenState(data.refreshToken);

      setState({
        isAuthenticated: true,
        isLoading: false,
        user: data.user,
        error: null,
      });
    } catch (error) {
      console.error('Login error:', error);
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: error instanceof Error ? error : new Error('Login failed'),
      });
      throw error;
    }
  }, []);

  // Logout method
  const logout = useCallback(async (): Promise<void> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Call logout API if needed
      if (accessToken) {
        try {
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: { Authorization: `Bearer ${accessToken}` },
          });
        } catch (error) {
          // Ignore logout API errors, still clear local state
          console.warn('Logout API call failed:', error);
        }
      }

      // Clear all auth data
      await Promise.all([
        deleteSecureItem('auth_token'),
        deleteSecureItem('refresh_token'),
        deleteSecureItem('session_data'),
      ]);

      setAccessTokenState(null);
      setRefreshTokenState(null);

      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Logout failed'),
      }));
    }
  }, [accessToken]);

  // Refresh session method
  const refreshSession = useCallback(async (): Promise<void> => {
    try {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Session refresh failed');
      }

      const data = await response.json();

      await setSecureItem('auth_token', data.accessToken);
      if (data.refreshToken) {
        await setSecureItem('refresh_token', data.refreshToken);
        setRefreshTokenState(data.refreshToken);
      }

      setAccessTokenState(data.accessToken);
    } catch (error) {
      console.error('Session refresh error:', error);
      // Clear tokens on refresh failure
      clearTokens();
      setState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: error instanceof Error ? error : new Error('Session expired'),
      });
      throw error;
    }
  }, [refreshToken, clearTokens]);

  // Biometric authentication
  const authenticateWithBiometric = useCallback(async (): Promise<BiometricAuthResult> => {
    try {
      const result = await biometricAuth.authenticate({
        promptMessage: 'Authenticate to access your account',
        fallbackLabel: 'Use passcode',
      });
      return result;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      throw error;
    }
  }, []);

  // Check if biometric is enabled
  const isBiometricEnabled = useCallback(async (): Promise<boolean> => {
    try {
      const enabled = await getSecureItem('biometric_enabled');
      return enabled === 'true';
    } catch {
      return false;
    }
  }, []);

  // Enable/disable biometric
  const enableBiometric = useCallback(async (enabled: boolean): Promise<void> => {
    try {
      await setSecureItem('biometric_enabled', enabled ? 'true' : 'false');
    } catch (error) {
      console.error('Failed to update biometric setting:', error);
      throw error;
    }
  }, []);

  const contextValue: AuthContextValue = {
    ...state,
    login,
    logout,
    refreshSession,
    authenticateWithBiometric,
    isBiometricEnabled,
    enableBiometric,
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
    clearTokens,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

/**
 * useAuth hook - Access auth context in components
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;
