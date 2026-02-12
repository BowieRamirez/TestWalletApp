import { apiClient } from "@/services/api-client";

export interface TransferRequest {
  recipientName: string;
  recipientAccountNumber: string;
  amount: number;
  currency: string;
  pin: string;
}

export interface TransferResponse {
  transactionId: string;
  status: "completed" | "pending" | "failed";
  timestamp: string;
}

export const transferService = {
  createTransfer: async (
    data: TransferRequest
  ): Promise<TransferResponse> => {
    const response = await apiClient.post<TransferResponse>(
      "/transfers",
      data
    );
    return response.data;
  },

  getTransferHistory: async () => {
    const response = await apiClient.get("/transfers/history");
    return response.data;
  },

  getFavoriteRecipients: async () => {
    const response = await apiClient.get("/transfers/favorites");
    return response.data;
  },
};
