import { Link } from "react-router-dom";
import { Badge, IconButton } from "@mui/material";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { ROUTES } from "../../app/router";

export function CartBadgeButton() {
  const { cartCount } = useCart();

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