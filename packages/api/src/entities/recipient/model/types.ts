export interface Recipient {
  id: string;
  userId: string;
  name: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  type: RecipientType;
  nickname?: string;
  isFavorite: boolean;
  createdAt: string;
}

export enum RecipientType {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
  INTERNATIONAL = 'international',
}
