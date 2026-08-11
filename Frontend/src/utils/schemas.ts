import { z } from "zod";

export const restaurantSchema = z.object({
  name: z.string().min(1, "Restaurant name is required"),
  location: z.string().min(1, "Location is required"),
  status: z.enum(["open", "closed"]).optional(),
  user_id: z.coerce.number().min(1, "Owner User ID must be a positive number").optional(),
});

export const menuItemSchema = z.object({
  name: z.string().min(1, "Menu item name is required"),
  price: z.coerce.number().gt(0, "Price must be greater than 0"),
  restaurant_id: z.coerce.number().min(1, "Restaurant assignment is required"),
});

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const adminLoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const adminRegisterSchema = z.object({
  user: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  }),
  restaurant: z.object({
    name: z.string().min(1, "Restaurant name is required"),
    location: z.string().min(1, "Location / Address is required"),
  }),
});

export type RestaurantFormData = z.infer<typeof restaurantSchema>;
export type MenuItemFormData = z.infer<typeof menuItemSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type AdminRegisterFormData = z.infer<typeof adminRegisterSchema>;