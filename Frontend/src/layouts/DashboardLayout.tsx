// frontend/src/app/DashboardLayout.tsx
import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { ROUTES } from "../app/router";
import { Utensils, BookOpen, ShoppingBag, ShoppingCart, Sun, Moon } from "lucide-react";
import { IconButton } from "@mui/material";

// Modular Imports
import { DesktopSidebar } from "../components/dashboard/DesktopSidebar";
import { MobileNavigation } from "../components/dashboard/MobileNavigation";
import { CartBadgeButton } from "../components/dashboard/CartBadgeButton";
import { useTheme } from "../context/ThemeContext"; // Grab our custom hook

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme, toggleTheme } = useTheme(); // Consume our theme state

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
    // Base layout: sets 60% canvas color globally and hides horizontal scrollbars during transitions
    <div className="min-h-screen bg-canvas text-text-main flex flex-col md:flex-row overflow-x-hidden">
      
      {/* Desktop Left-Hand Side Panel (Stays hidden below md) */}
      <DesktopSidebar 
        navigationItems={navigationItems}
        onLogout={handleLogoutClick}
        isLogoutPending={logoutMutation.isPending}
      />

      {/* Main Structural Wrapper Panel */}
      {/* 
        FIX 1: Set md:pl-[280px] to match the exact width of DesktopSidebar.
        This prevents the content from smashing against the sidebar or breaking on transition.
      */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-[280px] w-full transition-all duration-200">
        
        {/* Mobile Header (Handoffs layout seamlessly at the 'md' screen size) */}
        <MobileNavigation 
          navigationItems={navigationItems}
          onLogout={handleLogoutClick}
          isLogoutPending={logoutMutation.isPending}
        />

        {/* 
          Desktop-Only Top Header
          FIX 2: Ensure this header uses 'hidden md:flex' so it only becomes visible 
          at the exact pixel boundary where MobileNavigation hides itself.
        */}
        <header className="hidden md:flex h-16 bg-structure border-b border-text-muted/10 items-center justify-end px-8 sticky top-0 z-10 gap-4 transition-colors duration-200">
          
          {/* Theme Quick Switcher */}
          <IconButton 
            onClick={toggleTheme} 
            color="inherit" 
            size="small"
            aria-label="Toggle theme mode"
            sx={{ 
              color: 'var(--color-text-muted)',
              p: 0.75,
              borderRadius: '8px',
              border: '1px solid rgba(148, 163, 184, 0.15)',
              transition: 'all 0.2s ease',
              "&:hover": {
                borderColor: "var(--color-text-muted)",
                backgroundColor: "rgba(148, 163, 184, 0.05)"
              }
            }}
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </IconButton>

          <CartBadgeButton />
        </header>

        {/* Dynamic Viewport Panel Route Injector */}
        <main className="flex-1 relative focus:outline-none py-6 px-4 sm:px-6 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}