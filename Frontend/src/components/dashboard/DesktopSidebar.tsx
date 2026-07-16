import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button
} from "@mui/material";
import { LogOut, type LucideIcon } from "lucide-react";
import { useAuthUser } from "../../hooks/useAuthUser"; // Adjust to match your hook path
import { ROUTES } from "../../app/router";

interface NavigationItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

interface DesktopSidebarProps {
  navigationItems: NavigationItem[];
  onLogout: () => void;
  isLogoutPending: boolean;
}

export function DesktopSidebar({ navigationItems, onLogout, isLogoutPending }: DesktopSidebarProps) {
  const location = useLocation();
  const { isAdmin } = useAuthUser();

  // Filter out any cart links for admin users in the desktop sidebar
  const filteredNavigationItems = navigationItems.filter((item) => {
    if (isAdmin) {
      const isCartPath = item.path.toLowerCase().includes("cart");
      const isCartName = item.name.toLowerCase() === "cart";
      return !(isCartPath || isCartName);
    }
    return true;
  });

  return (
    <Box
      sx={{
        width: 280,
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        borderRight: "1px solid #e5e7eb",
        bgcolor: "#ffffff",
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        justifyContent: "space-between",
        p: 3,
        zIndex: 1200,
      }}
    >
      <div>
        {/* Desktop Branding (Clickable Logo Link) */}
        <Box
          component={Link}
          to={ROUTES.HOME}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 1,
            py: 1,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            F
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              letterSpacing: "-0.025em",
            }}
          >
            FoodSplits
          </Typography>
        </Box>

        <Divider sx={{ my: 2.5 }} />

        {/* Dynamic Sidebar Items */}
        <List sx={{ px: 0 }}>
          {filteredNavigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    py: 1.25,
                    px: 2,
                    "&.Mui-selected": {
                      backgroundColor: "rgba(37, 99, 235, 0.08)",
                      color: "#1d4ed8",
                      "&:hover": {
                        backgroundColor: "rgba(37, 99, 235, 0.12)",
                      },
                      "& .MuiListItemIcon-root": { color: "#2563eb" },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: isActive ? "#2563eb" : "text.secondary",
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    slotProps={{
                      primary: {
                        style: {
                          fontSize: "14px",
                          fontWeight: isActive ? 600 : 500,
                        },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </div>

      {/* Logout Action */}
      <Box>
        <Divider sx={{ mb: 2 }} />
        <Button
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<LogOut className="h-4 w-4" />}
          onClick={onLogout}
          disabled={isLogoutPending}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            py: 1,
          }}
        >
          {isLogoutPending ? "Signing out..." : "Sign Out"}
        </Button>
      </Box>
    </Box>
  );
}