import { createConsumer, Consumer } from "@rails/actioncable";

const getWebSocketUrl = (): string => {
  // Explicitly target Rails port 3000 for local dev
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const wsUrl = apiUrl.replace(/^http/, "ws").replace(/\/api\/?$/, "");
  
  return `${wsUrl}/cable`;
};

let consumer: Consumer | null = null;

export const getActionCableConsumer = (): Consumer => {
  if (!consumer) {
    consumer = createConsumer(getWebSocketUrl());
  }
  return consumer;
};

export const disconnectActionCable = (): void => {
  if (consumer) {
    consumer.disconnect();
    consumer = null;
  }
};