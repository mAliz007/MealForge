// src/hooks/useOrderNotifications.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthUser } from "./useAuthUser";
import { getActionCableConsumer } from "../services/actionCable";
import { useNotificationStore } from "../store/useNotificationStore";

export interface OrderNotificationPayload {
  id: number;
  status: string;
  restaurant_name: string;
  total_amount: number | null;
  created_at: string;
  message: string;
}

export function useOrderNotifications() {
  const { user } = useAuthUser();
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.showNotification);

  useEffect(() => {
    if (!user?.id) return;

    const consumer = getActionCableConsumer();

    const subscription = consumer.subscriptions.create(
      { channel: "OrderNotificationsChannel" },
      {
        connected() {
          console.log("[ActionCable] Connected & Subscribed to OrderNotificationsChannel");
        },
        disconnected() {
          console.log("[ActionCable] Disconnected from OrderNotificationsChannel");
        },
        received(data: OrderNotificationPayload) {
          console.log("[ActionCable] Notification payload received:", data);

          // 1. Invalidate orders list cache in TanStack Query
          queryClient.invalidateQueries({ queryKey: ["orders"] });

          // 2. Push payload directly to Zustand store
          showNotification(data);
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id, queryClient, showNotification]);
}