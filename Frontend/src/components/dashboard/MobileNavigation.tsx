// frontend/src/components/dashboard/MobileNavigation.tsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { LogOut, Sun, Moon, type LucideIcon } from "lucide-react";
import { CartBadgeButton } from "./CartBadgeButton";
import { useAuthUser } from "../../hooks/useAuthUser"; 
import { ROUTES } from "../../app/router";
import { useTheme } from "../../context/ThemeContext"; 

interface NavigationItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

interface MobileNavigationProps {
  navigationItems: NavigationItem[];
  onLogout: () => void;
  isLogoutPending: boolean;
}

export function MobileNavigation({ navigationItems, onLogout, isLogoutPending }: MobileNavigationProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAdmin } = useAuthUser();
  const { theme, toggleTheme } = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const filteredNavigationItems = navigationItems.filter((item) => {
    if (isAdmin) {
      const isCartPath = item.path.toLowerCase().includes("cart");
      const isCartName = item.name.toLowerCase() === "cart";
      return !(isCartPath || isCartName);
    }
    return true;
  });

  const drawerContent = (
    <Box 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between', 
        p: 2,
        bgcolor: 'var(--color-structure)',
        color: 'var(--color-text-main)',
        transition: 'background-color 0.2s ease, color 0.2s ease'
      }}
    >
      <div>
        <Box 
          component={Link}
          to={ROUTES.HOME}
          onClick={handleDrawerToggle}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5, 
            px: 2, 
            py: 2,
            textDecoration: 'none'
          }}
        >
          <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            F
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--color-text-main)', letterSpacing: '-0.025em' }}>
            FoodSplits
          </Typography>
        </Box>
        <Divider sx={{ my: 1, borderColor: 'rgba(148, 163, 184, 0.15)' }} />

        <List>
          {filteredNavigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={handleDrawerToggle}
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

      <Box sx={{ pb: 2 }}>
        <Button
          variant="text"
          fullWidth
          onClick={toggleTheme}
          startIcon={theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          sx={{
            mb: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            color: 'var(--color-text-muted)',
            fontWeight: 500,
            justifyContent: 'flex-start',
            px: 2,
            py: 1,
            "&:hover": {
              backgroundColor: "rgba(148, 163, 184, 0.08)",
            }
          }}
        >
          {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        </Button>
        <Divider sx={{ mb: 2, borderColor: 'rgba(148, 163, 184, 0.15)' }} />
        <Button
          variant="outlined"
          color="error"
          fullWidth
          startIcon={<LogOut className="h-4 w-4" />}
          onClick={() => {
            handleDrawerToggle();
            onLogout();
          }}
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
          {isLogoutPending ? "Signing out..." : "Sign Out"}
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          // FORCE: Explicitly hide using Tailwind's exact 768px breakpoint
          display: {
            xs: 'block',
            '@media (min-width: 768px)': {
              display: 'none'
            }
          },
          backgroundColor: 'var(--color-structure)',
          color: 'var(--color-text-main)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
          transition: 'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease'
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
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
            component={Link}
            to={ROUTES.HOME}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              textDecoration: 'none',
              color: 'inherit',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1
            }}
          >
            <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              F
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', letterSpacing: '-0.025em' }}>
              FoodSplits
            </Typography>
          </Box>

          <Box sx={{ zIndex: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              onClick={toggleTheme} 
              color="inherit" 
              size="small"
              sx={{ 
                color: 'var(--color-text-muted)',
                p: 0.75,
                borderRadius: '8px',
                border: '1px solid rgba(148, 163, 184, 0.15)'
              }}
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </IconButton>
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
          // FORCE: Drawer matches the 768px hide rule as well
          display: {
            xs: 'block',
            '@media (min-width: 768px)': {
              display: 'none'
            }
          },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            backgroundColor: 'transparent'
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}