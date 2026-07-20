// frontend/src/components/dashboard/DesktopSidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { Typography, List, ListItem, ListItemButton,  ListItemIcon, ListItemText, Divider, Button } from "@mui/material";
import { LogOut, type LucideIcon } from "lucide-react";
import { useAuthUser } from "../../hooks/useAuthUser";
import { ROUTES } from "../../app/router";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const filteredNavigationItems = navigationItems.filter((item) => {
    if (isAdmin) {
      const isCartPath = item.path.toLowerCase().includes("cart");
      const isCartName = item.name.toLowerCase() === "cart";
      return !(isCartPath || isCartName);
    }
    return true;
  });

  return (
    <aside className="hidden md:flex md:w-[280px] flex-col h-screen fixed left-0 top-0 bg-structure border-r border-text-muted/10 z-20 transition-all duration-200">
      <div className="flex flex-col h-full justify-between p-4">
        <div>
          {/* Logo Brand Header */}
          <Link to={ROUTES.HOME} className="flex items-center gap-3 px-4 py-3 no-underline">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white font-bold text-lg">
              F
            </div>
            <Typography variant="h6" className="font-bold text-text-main tracking-tight">
              FoodSplits
            </Typography>
          </Link>
          
          <Divider className="my-2 opacity-50" />

          {/* Nav Items */}
          <List className="py-2">
            {filteredNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.name} disablePadding className="mb-1">
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    selected={isActive}
                    sx={{
                      borderRadius: 2,
                      color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(30, 64, 175, 0.08)',
                        color: 'var(--color-accent)',
                        '&:hover': {
                          backgroundColor: 'rgba(30, 64, 175, 0.12)',
                        },
                        '& .MuiListItemIcon-root': { color: 'var(--color-accent)' }
                      },
                      "&:hover": {
                        backgroundColor: "rgba(148, 163, 184, 0.08)",
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
                      <Icon className="h-5 w-5" />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      slotProps={{
                        primary: {
                          style: { fontSize: '14px', fontWeight: isActive ? 600 : 500, color: 'inherit' }
                        }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </div>

        {/* Bottom Sidebar Action area */}
        <div className="pb-4">
          <Divider className="mb-4 opacity-50" />
          <Button
            variant="outlined"
            color="error"
            fullWidth
            startIcon={<LogOut className="h-4 w-4" />}
            onClick={onLogout}
            disabled={isLogoutPending}
            sx={{ 
              borderRadius: 2, 
              textTransform: 'none', 
              fontWeight: 600,
              borderColor: "rgba(239, 68, 68, 0.5)",
              "&:hover": {
                borderColor: "rgb(239, 68, 68)",
                backgroundColor: "rgba(239, 68, 68, 0.05)",
              }
            }}
          >
            {isLogoutPending ? t("navbar.loggingOut") : t("navbar.logout")}
          </Button>
        </div>
      </div>
    </aside>
  );
}