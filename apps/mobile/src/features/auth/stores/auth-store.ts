import { createStore, useStore } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

const authStore = createStore<AuthStore>((set) => ({
  // State
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  // Actions
  login: async (email: string, _password: string) => {
    set({ isLoading: true });
    try {
      // TODO: Replace with actual API call via authService
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: "1",
        name: "John Doe",
        email,
      };
      const mockToken = "mock-jwt-token";

      set({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (isLoading) => set({ isLoading }),
}));

/**
 * Hook to access the auth store.
 * Uses Zustand v5's createStore + useStore pattern.
 *
 * @example
 * const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
 * const login = useAuthStore((s) => s.login);
 */
export function useAuthStore<T>(selector: (state: AuthStore) => T): T {
  return useStore(authStore, selector);
}
