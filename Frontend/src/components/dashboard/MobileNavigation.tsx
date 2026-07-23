// frontend/src/components/dashboard/MobileNavigation.tsx
import { useState, useMemo } from "react";
import { AppBar, Toolbar, IconButton, Drawer, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { CartBadgeButton } from "./CartBadgeButton";
import { useAuthUser } from "../../hooks/useAuthUser";
import { AppLogo } from "./logo/AppLogo";
import { NavigationActions } from "./NavigationActions";
import { DrawerContent } from "./DrawerContent";
import type { NavigationItem } from "../../types/navigation";

interface MobileNavigationProps {
  navigationItems: NavigationItem[];
  onLogout: () => void;
  isLogoutPending: boolean;
}

export function MobileNavigation({ navigationItems, onLogout, isLogoutPending }: MobileNavigationProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAdmin } = useAuthUser();

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  // Filter navigation items based on user role
  const filteredNavigationItems = useMemo(() => {
    if (!isAdmin) return navigationItems;

    return navigationItems.filter((item) => {
      const isCartPath = item.path.toLowerCase().includes("cart");
      const isCartName = item.name.toLowerCase() === "cart";
      return !(isCartPath || isCartName);
    });
  }, [navigationItems, isAdmin]);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          display: {
            xs: "block",
            "@media (min-width: 768px)": { display: "none" },
          },
          backgroundColor: "var(--color-structure)",
          color: "var(--color-text-main)",
          borderBottom: "1px solid rgba(148, 163, 184, 0.15)",
          transition: "background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ zIndex: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1,
            }}
          >
            <AppLogo size="small" />
          </Box>

          <Box sx={{ zIndex: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <NavigationActions variant="header" />
            <CartBadgeButton />
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: {
            xs: "block",
            "@media (min-width: 768px)": { display: "none" },
          },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
            backgroundColor: "transparent",
          },
        }}
      >
        <DrawerContent
          navigationItems={filteredNavigationItems}
          onDrawerToggle={handleDrawerToggle}
          onLogout={onLogout}
          isLogoutPending={isLogoutPending}
        />
      </Drawer>
    </>
  );
}