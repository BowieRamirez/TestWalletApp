/**
 * Global TypeScript types for the MyBank mobile app.
 */

export type RootStackParamList = {
  "(auth)": undefined;
  "(tabs)": undefined;
  "(modals)": undefined;
};

export type AuthStackParamList = {
  login: undefined;
  biometric: undefined;
};

export type TabParamList = {
  "(home)": undefined;
  "(transfers)": undefined;
  "(accounts)": undefined;
};

export type ModalParamList = {
  "transfer-wizard": undefined;
  receipt: { transactionId?: string };
};
