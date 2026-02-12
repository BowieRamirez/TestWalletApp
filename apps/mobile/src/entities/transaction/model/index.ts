/**
 * Transaction Model
 *
 * Transaction entity types and state management
 */

export interface Transaction {
  id: string;
  accountId: string;
  type: 'debit' | 'credit' | 'transfer';
  amount: number;
  currency: string;
  description: string;
  recipientName?: string;
  recipientAccount?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
}

export const initialTransactionState: TransactionState = {
  transactions: [],
  isLoading: false,
  error: null,
  hasMore: true,
};
