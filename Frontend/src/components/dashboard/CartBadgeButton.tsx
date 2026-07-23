// frontend/src/components/dashboard/CartBadgeButton.tsx
import { Link } from "react-router-dom";
import { Badge, IconButton } from "@mui/material";
import { ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";
import { useAuthUser } from "../../hooks/useAuthUser";
import { ROUTES } from "../../app/router";

export function CartBadgeButton() {
  const { t } = useTranslation();
  const { cartCount } = useCart();
  const { isAdmin } = useAuthUser();

  // If the user is an admin, they don't need access to a personal checkout cart.
  if (isAdmin) {
    return null;
  }

  return (
    <IconButton
      component={Link}
      to = "/dashboard/cart"
      //to={ROUTES.DASHBOARD.CART}
      color="inherit"
      aria-label={t("cart.accessibility.badgeLabel", { count: cartCount })}
      sx={{ 
        // Use our semantic muted text variable for default state
        color: "var(--color-text-muted)",
        transition: "color 0.2s ease",
        "&:hover": { 
          // Switch to active brand accent color on hover
          color: "var(--color-accent)" 
        } 
      }}
    >
      <Badge 
        badgeContent={cartCount} 
        sx={{
          "& .MuiBadge-badge": {
            fontWeight: "bold",
            fontSize: "0.75rem",
            // Dynamically uses our accent color for the bubble highlight
            backgroundColor: "var(--color-accent)", 
            color: "#ffffff",
            transition: "background-color 0.2s ease"
          }
        }}
      >
        <ShoppingCart className="h-6 w-6" />
      </Badge>
    </IconButton>
  );
}