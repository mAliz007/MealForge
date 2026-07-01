// frontend/src/app/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Providers } from "./providers"; // ◄── Clean import!
import { DashboardLayout } from "../layouts/DashboardLayout";

// Import Views Explicitly
import LandingView from "../views/LandingView";
import LoginView from "../views/auth/LoginView"; 
import RegisterView from "../views/auth/RegisterView"; 
import RestaurantsView from "../views/dashboard/RestaurantsView";
import MenuItemsView from "../views/dashboard/MenuItemsView";
import OrdersView from "../views/dashboard/OrdersView";
import CartView from "../views/dashboard/CartView";

export default function App() {
  return (
    <Providers> {/* ◄── Wraps the whole app cleanly */}
      <BrowserRouter>
        <Routes>
          {/* Main Entry Points */}
          <Route path="/" element={<LandingView />} /> 
          <Route path="/login" element={<LoginView />} />   
          <Route path="/register" element={<RegisterView />} />

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
    </Providers>
  );
}