// src/hooks/useOrderNotifications.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthUser } from "./useAuthUser";
import { getActionCableConsumer } from "../services/actionCable";
import { useNotificationStore } from "../store/useNotificationStore";
import { downloadBase64Pdf } from "../utils/pdfDownloader";

export interface OrderNotificationPayload {
  event?: "order_created";
  id: number;
  status: string;
  restaurant_name: string;
  total_amount: number | null;
  created_at: string;
  message: string;
}

export interface InvoiceGeneratedPayload {
  event: "invoice_generated";
  order_id: number;
  filename: string;
  pdf_data: string;
  message?: string;
}

export type ActionCablePayload = OrderNotificationPayload | InvoiceGeneratedPayload;

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
        received(data: ActionCablePayload) {
          console.log("[ActionCable] Notification payload received:", data);

          // 1. Handle Invoice Generated Event
          if ("event" in data && data.event === "invoice_generated") {
            if (data.pdf_data) {
              downloadBase64Pdf(data.pdf_data, data.filename);

              // Push payload tagged with event: "invoice_generated"
              // Note: If you want NO popup at all when downloading, simply remove/comment the showNotification line below!
              showNotification({
                event: "invoice_generated",
                order_id: data.order_id,
                message: data.message || `Invoice for Order #${data.order_id} generated and downloaded!`,
              } as any);
            }
            return;
          }

          // 2. Handle Standard Order Created Event
          const orderData = data as OrderNotificationPayload;

          // Invalidate orders list cache in TanStack Query
          queryClient.invalidateQueries({ queryKey: ["orders"] });

          // Push payload directly to Zustand store
          showNotification(orderData);
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id, queryClient, showNotification]);
}