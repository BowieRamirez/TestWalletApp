export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  kycStatus: KycStatus;
  address?: Address;
  settings: UserSettings;
  createdAt: string;
  updatedAt: string;
}

export enum KycStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export interface UserSettings {
  notificationsEnabled: boolean;
  biometricEnabled: boolean;
  language: string;
  currency: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
