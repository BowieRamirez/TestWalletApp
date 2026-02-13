import { useQuery } from "@tanstack/react-query";
import type { AccountsData } from "../types";

const MOCK_DASHBOARD: AccountsData = {
  totalBalance: 57711.25,
  primaryAccountNumber: "4521890032",
  accounts: [
    {
      id: "acc-1",
      name: "Main Checking",
      balance: 45211.25,
      accountNumber: "4521890032",
      type: "checking",
      currency: "PHP",
    },
    {
      id: "acc-2",
      name: "Savings",
      balance: 12500.0,
      accountNumber: "4521890045",
      type: "savings",
      currency: "PHP",
    },
  ],
  recentTransactions: [
    {
      id: "1",
      title: "Grocery Store",
      date: "Today, 2:30 PM",
      amount: 85.4,
      type: "debit",
      category: "shopping",
    },
    {
      id: "2",
      title: "Salary Deposit",
      date: "Yesterday",
      amount: 4500.0,
      type: "credit",
      category: "income",
    },
    {
      id: "3",
      title: "Netflix Subscription",
      date: "Feb 10",
      amount: 549.0,
      type: "debit",
      category: "entertainment",
    },
    {
      id: "4",
      title: "Transfer from Jane",
      date: "Feb 9",
      amount: 2000.0,
      type: "credit",
      category: "transfer",
    },
    {
      id: "5",
      title: "Electric Bill",
      date: "Feb 8",
      amount: 2350.0,
      type: "debit",
      category: "bills",
    },
    {
      id: "6",
      title: "Coffee Shop",
      date: "Feb 7",
      amount: 185.0,
      type: "debit",
      category: "food",
    },
  ],
};

/**
 * Query hook for the accounts dashboard data.
 * Uses mock data directly until a real API is connected.
 */
export function useAccounts() {
  return useQuery<AccountsData>({
    queryKey: ["accounts", "dashboard"],
    queryFn: async () => {
      // Return mock data directly — replace with API call when backend is ready
      // e.g. return accountsService.getDashboard();
      return MOCK_DASHBOARD;
    },
    staleTime: 30_000, // 30 seconds
  });
}
