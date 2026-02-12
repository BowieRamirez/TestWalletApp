export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: "credit" | "debit";
  category?: string;
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  accountNumber: string;
  type: "checking" | "savings";
  currency: string;
}

export interface AccountsData {
  totalBalance: number;
  primaryAccountNumber: string;
  accounts: Account[];
  recentTransactions: Transaction[];
}
