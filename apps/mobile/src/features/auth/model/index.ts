/**
 * Auth Model
 *
 * State management and business logic for authentication
 */

export interface AuthState {
  isAuthenticated: boolean;
  user: null | Record<string, unknown>;
  token: string | null;
}

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};
