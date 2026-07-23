export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD_ROOT: "/dashboard/*",
  DASHBOARD: {
    DEFAULT: "/dashboard/restaurants",
    RESTAURANTS: "restaurants",
    MENU_ITEMS: "menu-items",
    ORDERS: "orders",
    CART: "cart",
  },
} as const; 