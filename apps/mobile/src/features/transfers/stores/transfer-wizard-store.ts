import { createStore, useStore } from "zustand";

interface Recipient {
  name: string;
  accountNumber: string;
}

type WizardStep = "recipient" | "amount" | "review" | "pin";

interface TransferWizardState {
  step: WizardStep;
  recipient: Recipient;
  amount: string;
  pin: string;
}

interface TransferWizardActions {
  setRecipient: (recipient: Recipient) => void;
  setAmount: (amount: string) => void;
  setPin: (pin: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

type TransferWizardStore = TransferWizardState & TransferWizardActions;

const STEPS: WizardStep[] = ["recipient", "amount", "review", "pin"];

const initialState: TransferWizardState = {
  step: "recipient",
  recipient: { name: "", accountNumber: "" },
  amount: "",
  pin: "",
};

const transferWizardStore = createStore<TransferWizardStore>((set, get) => ({
  ...initialState,

  setRecipient: (recipient) => set({ recipient }),
  setAmount: (amount) => set({ amount }),
  setPin: (pin) => set({ pin }),

  nextStep: () => {
    const currentIndex = STEPS.indexOf(get().step);
    if (currentIndex < STEPS.length - 1) {
      set({ step: STEPS[currentIndex + 1] });
    }
  },

  prevStep: () => {
    const currentIndex = STEPS.indexOf(get().step);
    if (currentIndex > 0) {
      set({ step: STEPS[currentIndex - 1] });
    }
  },

  reset: () => set(initialState),
}));

/**
 * Hook for the multi-step transfer wizard.
 * Used by the transfer-wizard modal screen.
 */
export function useTransferWizardStore<T>(
  selector: (state: TransferWizardStore) => T
): T {
  return useStore(transferWizardStore, selector);
}

// Also export a convenience hook that returns all state/actions
export function useTransferWizard(): TransferWizardStore {
  return useStore(transferWizardStore);
}
