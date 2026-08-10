// frontend/src/components/dashboard/navigation/DrawerContent.tsx
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppLogo } from "./logo/AppLogo";
import { NavigationActions } from "./NavigationActions";
import type { NavigationItem } from "../../types/navigation";

interface DrawerContentProps {
  navigationItems: NavigationItem[];
  onDrawerToggle: () => void;
  onLogout: () => void;
  isLogoutPending: boolean;
}

export function DrawerContent({
  navigationItems,
  onDrawerToggle,
  onLogout,
  isLogoutPending,
}: DrawerContentProps) {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
        bgcolor: "var(--color-structure)",
        color: "var(--color-text-main)",
        transition: "background-color 0.2s ease, color 0.2s ease",
      }}
    >
      <div>
        <Box sx={{ px: 2, py: 2 }}>
          <AppLogo onClick={onDrawerToggle} />
        </Box>
        <Divider sx={{ my: 1, borderColor: "rgba(148, 163, 184, 0.15)" }} />

        <List>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={onDrawerToggle}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    color: isActive ? "var(--color-accent)" : "var(--color-text-muted)",
                    "&.Mui-selected": {
                      backgroundColor: "rgba(30, 64, 175, 0.08)",
                      color: "var(--color-accent)",
                      "&:hover": { backgroundColor: "rgba(30, 64, 175, 0.12)" },
                      "& .MuiListItemIcon-root": { color: "var(--color-accent)" },
                    },
                    "&:hover": { backgroundColor: "rgba(148, 163, 184, 0.08)" },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: isActive ? "var(--color-accent)" : "var(--color-text-muted)" }}>
                    <Icon className="h-5 w-5" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    slotProps={{
                      primary: {
                        style: { fontSize: "14px", fontWeight: isActive ? 600 : 500, color: "inherit" },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </div>

      <Box sx={{ pb: 2 }}>
        <NavigationActions variant="drawer" />

        <Divider sx={{ mb: 2, borderColor: "rgba(148, 163, 184, 0.15)" }} />

        <Button
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<LogOut className="h-4 w-4" />}
          onClick={() => {
            onDrawerToggle();
            onLogout();
          }}
          disabled={isLogoutPending}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            borderColor: "rgba(239, 68, 68, 0.5)",
            "&:hover": {
              borderColor: "rgb(239, 68, 68)",
              backgroundColor: "rgba(239, 68, 68, 0.05)",
            },
          }}
        >
          {isLogoutPending ? t("navbar.loggingOut") : t("navbar.logout")}
        </Button>
      </Box>
    </Box>
  );
}