// frontend/src/utils/mockData.ts
import { type Restaurant, type MenuItem, type Order } from "../types";

export const mockRestaurants: Restaurant[] = [
  { id: 1, name: "The Gourmet Burger Hub", location: "Downtown Sector A", status: "active" },
  { id: 2, name: "Pizzeria Napoli", location: "Westside Boulevard", status: "active" },
  { id: 3, name: "Sushi Zen Garden", location: "Uptown Square", status: "inactive" },
];

export const mockMenuItems: MenuItem[] = [
  { id: 101, restaurantId: 1, name: "Truffle Bacon Cheeseburger", description: "Prime beef patty with black truffle aioli and crispy bacon.", price: 14.99, available: true },
  { id: 102, restaurantId: 1, name: "Garlic Parmesan Fries", description: "Hand-cut fries tossed in fresh garlic oil and shredded aged parmesan.", price: 5.49, available: true },
  { id: 103, restaurantId: 2, name: "Margherita Supreme Pizza", description: "San Marzano tomatoes, fresh buffalo mozzarella, and aromatic sweet basil.", price: 18.25, available: true },
];

export const mockOrders: Order[] = [
  { id: 5001, restaurantId: 1, status: "confirmed", totalAmount: 35.47 },
  { id: 5002, restaurantId: 2, status: "pending", totalAmount: 18.25 },
  { id: 5003, restaurantId: 3, status: "cancelled", totalAmount: 42.00 },
];