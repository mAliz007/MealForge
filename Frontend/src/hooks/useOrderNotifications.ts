import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthUser } from "./useAuthUser";
import { getActionCableConsumer } from "../services/actionCable";

export interface OrderNotificationPayload {
  id: number;
  status: string;
  restaurant_name: string;
  total_amount: number | null;
  created_at: string;
  message: string;
}

export function useOrderNotifications(
  onNotificationReceived?: (notification: OrderNotificationPayload) => void
) {
  const { user } = useAuthUser();
  const queryClient = useQueryClient();

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

          // Invalidate orders list cache in TanStack Query
          queryClient.invalidateQueries({ queryKey: ["orders"] });

          if (onNotificationReceived) {
            onNotificationReceived(data);
          }
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id, queryClient, onNotificationReceived]);
}