/**
 * Account Model
 *
 * Account entity types and state management
 */

export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  accountType: 'checking' | 'savings' | 'credit';
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
}

export interface AccountState {
  accounts: Account[];
  selectedAccount: Account | null;
  isLoading: boolean;
  error: string | null;
}

export const initialAccountState: AccountState = {
  accounts: [],
  selectedAccount: null,
  isLoading: false,
  error: null,
};
