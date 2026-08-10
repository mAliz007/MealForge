// src/store/useNotificationStore.ts
import { create } from "zustand";
import type { OrderNotificationPayload } from "../hooks/useOrderNotifications";

interface NotificationState {
  activeNotification: OrderNotificationPayload | null;
  showNotification: (notification: OrderNotificationPayload) => void;
  clearNotification: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  activeNotification: null,
  showNotification: (notification) => set({ activeNotification: notification }),
  clearNotification: () => set({ activeNotification: null }),
}));