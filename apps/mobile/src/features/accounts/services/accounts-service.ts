import { apiClient } from "@/services/api-client";
import type { AccountsData, Account } from "../types";

export const accountsService = {
  getAccounts: async (): Promise<Account[]> => {
    const response = await apiClient.get<Account[]>("/accounts");
    return response.data;
  },

  getAccountById: async (id: string): Promise<Account> => {
    const response = await apiClient.get<Account>(`/accounts/${id}`);
    return response.data;
  },

  getDashboard: async (): Promise<AccountsData> => {
    const response = await apiClient.get<AccountsData>("/accounts/dashboard");
    return response.data;
  },
};
