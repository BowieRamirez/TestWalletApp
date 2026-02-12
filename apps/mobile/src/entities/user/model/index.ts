/**
 * User Model
 *
 * User entity types and state management
 */

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

export const initialUserState: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
};
