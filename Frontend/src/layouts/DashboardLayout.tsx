// frontend/src/app/DashboardLayout.tsx
import { type ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { ROUTES } from "../app/router";
import { Utensils, BookOpen, ShoppingBag, ShoppingCart, Sun, Moon, Languages } from "lucide-react";
import { IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";

// Modular Imports
import { DesktopSidebar } from "../components/dashboard/DesktopSidebar";
import { MobileNavigation } from "../components/dashboard/MobileNavigation";
import { CartBadgeButton } from "../components/dashboard/CartBadgeButton";
import { useTheme } from "../context/ThemeContext";

// Real-time Action Cable Hook & Toast UI
import { useOrderNotifications, type OrderNotificationPayload } from "../hooks/useOrderNotifications";
import { NotificationToast } from "../components/ui/NotificationToast";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  // Active notification state for real-time alerts
  const [activeNotification, setActiveNotification] = useState<OrderNotificationPayload | null>(null);

  // Listen for real-time WebSocket order notifications
  useOrderNotifications((notification) => {
    setActiveNotification(notification);
  });

  const navigationItems = [
    { name: t("navbar.restaurants"), path: "/dashboard/restaurants", icon: Utensils },
    { name: t("navbar.menuCatalog"), path: "/dashboard/menu-items", icon: BookOpen },
    { name: t("navbar.ordersLedger"), path: "/dashboard/orders", icon: ShoppingBag },
    { name: t("navbar.activeCart"), path: "/dashboard/cart", icon: ShoppingCart },
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

  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith("en") ? "es" : "en";
    i18n.changeLanguage(nextLang);
  };

  return (
    <div className="min-h-screen bg-canvas text-text-main flex flex-col md:flex-row overflow-x-hidden transition-colors duration-200">
      
      {/* 1. Desktop Left Sidebar */}
      <DesktopSidebar 
        navigationItems={navigationItems}
        onLogout={handleLogoutClick}
        isLogoutPending={logoutMutation.isPending}
      />

      {/* 2. Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-[280px] w-full min-h-screen transition-all duration-200">
        
        {/* Mobile Navigation */}
        <MobileNavigation 
          navigationItems={navigationItems}
          onLogout={handleLogoutClick}
          isLogoutPending={logoutMutation.isPending}
        />

        {/* Desktop Header */}
        <header className="hidden md:flex h-16 bg-structure border-b border-text-muted/10 items-center justify-end px-8 sticky top-0 z-10 gap-4 transition-colors duration-200">
          <IconButton 
            onClick={toggleLanguage} 
            color="inherit" 
            size="small"
            aria-label="Toggle language"
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
            <div className="flex items-center gap-1.5 px-1">
              <Languages className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase">
                {i18n.language.startsWith("en") ? "es" : "en"}
              </span>
            </div>
          </IconButton>

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

        {/* Core Screen View */}
        <main className="flex-1 relative focus:outline-none py-6 px-4 sm:px-6 md:px-8">
          {children}
        </main>
      </div>

      {/* Global Real-time Notification Toast */}
      <NotificationToast 
        notification={activeNotification}
        onClose={() => setActiveNotification(null)}
      />
    </div>
  );
}