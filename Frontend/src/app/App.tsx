// Frontend/src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { ROUTES } from "./router";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";

// Import Views Explicitly
import LandingView from "~views/LandingView";
import LoginView from "~views/auth/LoginView";
import RegisterView from "~views/auth/RegisterView";
import RestaurantsView from "~views/dashboard/RestaurantsView";
import MenuItemsView from "~views/dashboard/MenuItemsView";
import OrdersView from "~views/dashboard/OrdersView";
import CartView from "~views/dashboard/CartView";
import { CartProvider } from "../context/CartContext";

// Import Global Alert Dialog
import { AlertDialog } from "../components/ui/AlertDialog";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Main Entry Points */}
            <Route path={ROUTES.HOME} element={<LandingView />} />
            <Route path={ROUTES.LOGIN} element={<LoginView />} />
            <Route path={ROUTES.REGISTER} element={<RegisterView />} />

            {/* Nested Dashboard Router Wrapper Subtree */}
            <Route
              path={ROUTES.DASHBOARD_ROOT}
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Routes>
                      <Route
                        index
                        element={
                          <Navigate
                            to={ROUTES.DASHBOARD.DEFAULT}
                            replace
                          />
                        }
                      />
                      <Route
                        path={ROUTES.DASHBOARD.RESTAURANTS}
                        element={<RestaurantsView />}
                      />
                      <Route
                        path={ROUTES.DASHBOARD.MENU_ITEMS}
                        element={<MenuItemsView />}
                      />
                      <Route
                        path={ROUTES.DASHBOARD.ORDERS}
                        element={<OrdersView />}
                      />
                      <Route
                        path={ROUTES.DASHBOARD.CART}
                        element={<CartView />}
                      />
                    </Routes>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        </BrowserRouter>
        
        {/* Mount Global Alert Dialog */}
        <AlertDialog />
      </CartProvider>
    </QueryClientProvider>
  );
}