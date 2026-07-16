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
import { LogOut, type LucideIcon } from "lucide-react";
import { CartBadgeButton } from "./CartBadgeButton";
import { useAuthUser } from "../../hooks/useAuthUser"; // Adjust import path
import { ROUTES } from "../../app/router";

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Filter navigation items dynamically for mobile sidebar
  const filteredNavigationItems = navigationItems.filter((item) => {
    if (isAdmin) {
      const isCartPath = item.path.toLowerCase().includes("cart");
      const isCartName = item.name.toLowerCase() === "cart";
      return !(isCartPath || isCartName);
    }
    return true;
  });

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 2 }}>
      <div>
        {/* Mobile Sidebar Branding (Clickable Logo Link) */}
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
          <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            F
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', letterSpacing: '-0.025em' }}>
            FoodSplits
          </Typography>
        </Box>
        <Divider sx={{ my: 1 }} />

        {/* Dynamic Navigation List inside Drawer */}
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
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(37, 99, 235, 0.08)',
                      color: '#1d4ed8',
                      '&:hover': {
                        backgroundColor: 'rgba(37, 99, 235, 0.12)',
                      },
                      '& .MuiListItemIcon-root': { color: '#2563eb' }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: isActive ? '#2563eb' : 'text.secondary' }}>
                    <Icon className="h-5 w-5" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    slotProps={{
                      primary: {
                        style: { fontSize: '14px', fontWeight: isActive ? 600 : 500 }
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </div>

      {/* Action Area */}
      <Box sx={{ pb: 2 }}>
        <Divider sx={{ mb: 2 }} />
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
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
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
          display: { md: 'none' },
          backgroundColor: '#ffffff',
          color: '#111827',
          borderBottom: '1px solid #e5e7eb'
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          {/* Hamburger Menu (Left) */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ zIndex: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Centered Brand Logo */}
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
            <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              F
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', letterSpacing: '-0.025em' }}>
              FoodSplits
            </Typography>
          </Box>

          {/* Cart Icon Box (Self-hides internally if Admin) */}
          <Box sx={{ zIndex: 2, minWidth: 40, display: 'flex', justifyContent: 'flex-end' }}>
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
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}