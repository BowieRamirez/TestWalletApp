export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: Address;
  kycStatus: 'pending' | 'verified' | 'rejected';
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  accountType: 'checking' | 'savings' | 'investment';
  currency: string;
  balance: number;
  availableBalance: number;
  holdAmount: number;
  status: 'active' | 'frozen' | 'closed';
  openedAt: string;
  closedAt?: string;
  nickname?: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: 'debit' | 'credit' | 'transfer' | 'fee' | 'interest';
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'reversed';
  counterparty?: Counterparty;
  referenceNumber: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  completedAt?: string;
}

export interface Counterparty {
  name: string;
  accountNumber?: string;
  bankName?: string;
  bankCode?: string;
}

export interface Recipient {
  id: string;
  userId: string;
  name: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  nickname?: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountId?: string;
  recipientId?: string;
  externalRecipient?: ExternalRecipient;
  amount: number;
  currency: string;
  description: string;
  scheduledDate?: string;
}

export interface ExternalRecipient {
  name: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
}

export interface TransferResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fromAccountId: string;
  toAccountId?: string;
  amount: number;
  currency: string;
  description: string;
  referenceNumber: string;
  estimatedCompletionDate?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
