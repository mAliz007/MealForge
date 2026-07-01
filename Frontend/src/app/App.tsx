// frontend/src/app/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DashboardLayout } from "../layouts/DashboardLayout";

// Import Views Explicitly
import LandingView from "../views/LandingView";
import LoginView from "../views/auth/LoginView";       // ◄── Added real view import
import RegisterView from "../views/auth/RegisterView"; // ◄── Added real view import
import RestaurantsView from "../views/dashboard/RestaurantsView";
import MenuItemsView from "../views/dashboard/MenuItemsView";
import OrdersView from "../views/dashboard/OrdersView";
import CartView from "../views/dashboard/CartView";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Main Entry Points */}
          <Route path="/" element={<LandingView />} /> 
          <Route path="/login" element={<LoginView />} />       {/* ◄── Swapped out placeholder for component */}
          <Route path="/register" element={<RegisterView />} /> {/* ◄── Swapped out placeholder for component */}

          {/* Nested Dashboard Router Wrapper Subtree */}
          <Route path="/dashboard/*" element={
            <DashboardLayout>
              <Routes>
                <Route index element={<Navigate to="/dashboard/restaurants" replace />} />
                <Route path="restaurants" element={<RestaurantsView />} />
                <Route path="menu-items" element={<MenuItemsView />} />
                <Route path="orders" element={<OrdersView />} />
                <Route path="cart" element={<CartView />} />
              </Routes>
            </DashboardLayout>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}