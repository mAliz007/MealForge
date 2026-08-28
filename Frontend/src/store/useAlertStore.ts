// frontend/src/store/useAlertStore.ts
import { create } from "zustand";

export interface AlertOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void | Promise<void>;
}

interface AlertStore {
  isOpen: boolean;
  options: AlertOptions | null;
  showAlert: (options: AlertOptions) => void;
  closeAlert: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  isOpen: false,
  options: null,
  showAlert: (options) => set({ isOpen: true, options }),
  closeAlert: () => set({ isOpen: false, options: null }),
}));