import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { ROUTES } from "../app/router";
import { Utensils, BookOpen, ShoppingBag, ShoppingCart } from "lucide-react";

// Modular Imports
import { DesktopSidebar } from "../components/dashboard/DesktopSidebar";
import { MobileNavigation } from "../components/dashboard/MobileNavigation";
import { CartBadgeButton } from "../components/dashboard/CartBadgeButton";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const navigationItems = [
    { name: "Restaurants", path: "/dashboard/restaurants", icon: Utensils },
    { name: "Menu Catalog", path: "/dashboard/menu-items", icon: BookOpen },
    { name: "Orders Ledger", path: "/dashboard/orders", icon: ShoppingBag },
    { name: "Active Cart", path: "/dashboard/cart", icon: ShoppingCart },
  ];

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
      navigate(ROUTES.LOGIN, { replace: true });
    },
    onError: (error) => {
      console.error("Sign out transaction failed:", error);
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
      navigate(ROUTES.LOGIN, { replace: true });
    },
  });

  const handleLogoutClick = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Desktop Left-Hand Side Panel */}
      <DesktopSidebar 
        navigationItems={navigationItems}
        onLogout={handleLogoutClick}
        isLogoutPending={logoutMutation.isPending}
      />

      {/* Main Structural Wrapper Panel */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        
        {/* Mobile Header (AppBar + Drawer overlay) */}
        <MobileNavigation 
          navigationItems={navigationItems}
          onLogout={handleLogoutClick}
          isLogoutPending={logoutMutation.isPending}
        />

        {/* Desktop-Only Top Header (Holds top-right cart button matching side offset) */}
        <header className="hidden md:flex h-16 bg-white border-b border-gray-200 items-center justify-end px-8 sticky top-0 z-10">
          <CartBadgeButton />
        </header>

        {/* Dynamic Viewport Panel Route Injector */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none py-6 px-4 sm:px-6 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}