export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description: string;
  counterparty?: Counterparty;
  reference?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export enum TransactionType {
  DEBIT = 'debit',
  CREDIT = 'credit',
  TRANSFER = 'transfer',
  PAYMENT = 'payment',
  FEE = 'fee',
  REFUND = 'refund',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REVERSED = 'reversed',
  CANCELLED = 'cancelled',
}

export interface Counterparty {
  name: string;
  accountNumber?: string;
  bankName?: string;
  bankCode?: string;
}
