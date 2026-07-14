// frontend/src/utils/schemas.ts
import { z } from "zod";

export const restaurantSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  location: z.string().min(1, "Location is required"),
  status: z.enum(["open", "closed"]),
});

export const menuItemSchema = z.object({
  name: z.string().min(1, "Menu item name is required"),
  price: z.coerce.number().gt(0, "Price must be greater than 0"),
  restaurantId: z.coerce.number().min(1, "Restaurant assignment is required"),
});

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// Infer TypeScript types directly from schemas
export type RestaurantFormData = z.infer<typeof restaurantSchema>;
export type MenuItemFormData = z.infer<typeof menuItemSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;