import { Link } from "react-router-dom";
import { Badge, IconButton } from "@mui/material";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuthUser } from "../../hooks/useAuthUser"; // Path to your useAuthUser hook
import { ROUTES } from "../../app/router";

export function CartBadgeButton() {
  const { cartCount } = useCart();
  const { isAdmin } = useAuthUser();

  // If the user is an admin, they don't need access to a personal checkout cart.
  if (isAdmin) {
    return null;
  }

  return (
    <IconButton
      component={Link}
      to={ROUTES.DASHBOARD.CART}
      color="inherit"
      aria-label={`cart with ${cartCount} items`}
      sx={{ 
        color: "text.secondary",
        "&:hover": { color: "primary.main" } 
      }}
    >
      <Badge 
        badgeContent={cartCount} 
        sx={{
          "& .MuiBadge-badge": {
            fontWeight: "bold",
            fontSize: "0.75rem",
            backgroundColor: "#2563eb", 
            color: "#ffffff"
          }
        }}
      >
        <ShoppingCart className="h-6 w-6" />
      </Badge>
    </IconButton>
  );
}