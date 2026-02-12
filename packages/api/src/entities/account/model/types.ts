export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  accountType: AccountType;
  currency: string;
  balance: Balance;
  status: AccountStatus;
  name?: string;
  openedAt: string;
}

export enum AccountType {
  CHECKING = 'checking',
  SAVINGS = 'savings',
  INVESTMENT = 'investment',
}

export enum AccountStatus {
  ACTIVE = 'active',
  FROZEN = 'frozen',
  CLOSED = 'closed',
}

export interface Balance {
  available: number;
  held: number;
  total: number;
}
