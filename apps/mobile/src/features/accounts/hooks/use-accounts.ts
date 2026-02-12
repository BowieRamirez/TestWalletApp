import { useQuery } from "@tanstack/react-query";
import type { AccountsData } from "../types";

const MOCK_DASHBOARD: AccountsData = {
  totalBalance: 57711.25,
  primaryAccountNumber: "4521890032",
  accounts: [],
  recentTransactions: [
    {
      id: "1",
      title: "Grocery Store",
      date: "Today, 2:30 PM",
      amount: 85.4,
      type: "debit",
    },
    {
      id: "2",
      title: "Salary Deposit",
      date: "Yesterday",
      amount: 4500.0,
      type: "credit",
    },
    {
      id: "3",
      title: "Netflix Subscription",
      date: "Feb 10",
      amount: 15.99,
      type: "debit",
    },
    {
      id: "4",
      title: "Transfer from Jane",
      date: "Feb 9",
      amount: 200.0,
      type: "credit",
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
