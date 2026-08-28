export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",

  ADMIN_LOGIN: "/admin/login",
  ADMIN_REGISTER: "/admin/register",

  
  DASHBOARD_ROOT: "/dashboard/*",
  DASHBOARD: {
    DEFAULT: "/dashboard/restaurants",
    RESTAURANTS: "restaurants",
    MENU_ITEMS: "menu-items",
    ORDERS: "orders",
    STAFF: "staff",
    CART: "cart",
  },
} as const;