import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // CRUCIAL: Instructs the browser to automatically attach and accept cookies
  // during cross-origin handshakes with your Rails backend
  withCredentials: true,
})