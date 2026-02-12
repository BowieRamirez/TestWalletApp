import { create } from 'zustand';
import { persist, createJSONStorage, type PersistOptions } from 'zustand/middleware';
import { sessionCacheStorage } from '@banking/security';
import type { AuthState, AuthTokens, User } from './types';

interface AuthStore extends AuthState {
  // Actions
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
  setTokens: (tokens: AuthTokens) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  updateUser: (user: Partial<User>) => void;
}

const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Custom storage that only persists refreshToken
interface PersistedAuthState {
  tokens: { refreshToken: string } | null;
}

const persistOptions: PersistOptions<AuthStore, PersistedAuthState> = {
  name: 'auth-storage',
  storage: createJSONStorage(() => sessionCacheStorage),
  partialize: (state): PersistedAuthState => ({
    // Only persist refreshToken, not accessToken for security
    tokens: state.tokens
      ? { refreshToken: state.tokens.refreshToken }
      : null,
  }),
  onRehydrateStorage: () => (state, error) => {
    if (error) {
      console.error('Failed to rehydrate auth state:', error);
    }
  },
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: (user: User, tokens: AuthTokens) => {
        set({
          user,
          tokens,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      },

      logout: () => {
        set({
          ...initialState,
        });
      },

      setTokens: (tokens: AuthTokens) => {
        set({
          tokens,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        set({
          ...initialState,
        });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      updateUser: (userUpdate: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userUpdate },
          });
        }
      },
    }),
    persistOptions
  )
);

// Selectors for better performance
export const selectUser = (state: AuthState) => state.user;
export const selectTokens = (state: AuthState) => state.tokens;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectError = (state: AuthState) => state.error;
