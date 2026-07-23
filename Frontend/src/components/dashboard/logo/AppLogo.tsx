// frontend/src/components/dashboard/logo/AppLogo.tsx
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../app/router";

interface AppLogoProps {
  onClick?: () => void;
  size?: "small" | "medium";
}

export function AppLogo({ onClick, size = "medium" }: AppLogoProps) {
  const isSmall = size === "small";

  return (
    <Box
      component={Link}
      to={ROUTES.HOME}
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: isSmall ? 1 : 1.5,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: 2,
          bgcolor: "var(--color-accent)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
        }}
      >
        F
      </Box>
      <Typography
        variant={isSmall ? "subtitle1" : "h6"}
        sx={{
          fontWeight: "bold",
          color: "var(--color-text-main)",
          letterSpacing: "-0.025em",
        }}
      >
        FoodSplits
      </Typography>
    </Box>
  );
}