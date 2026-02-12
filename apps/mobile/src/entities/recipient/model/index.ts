/**
 * Recipient Model
 *
 * Recipient entity types and state management
 */

export interface Recipient {
  id: string;
  userId: string;
  name: string;
  accountNumber: string;
  bankCode?: string;
  bankName?: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface RecipientState {
  recipients: Recipient[];
  isLoading: boolean;
  error: string | null;
}

export const initialRecipientState: RecipientState = {
  recipients: [],
  isLoading: false,
  error: null,
};
