import { createConsumer, Consumer } from "@rails/actioncable";

const getWebSocketUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  
  // Replaces 'https' with 'wss' and 'http' with 'ws'
  const wsUrl = apiUrl.replace(/^http(s?):/, "ws$1:").replace(/\/api\/?$/, "");
  
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