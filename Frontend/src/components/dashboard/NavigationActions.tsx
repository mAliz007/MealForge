// frontend/src/components/dashboard/navigation/NavigationActions.tsx
import { IconButton, Button } from "@mui/material";
import { Sun, Moon, Languages } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";

interface NavigationActionsProps {
  variant?: "header" | "drawer";
}

export function NavigationActions({ variant = "header" }: NavigationActionsProps) {
  const { theme, toggleTheme } = useTheme();
  const { i18n } = useTranslation();

  const isEn = i18n.language.startsWith("en");
  const nextLang = isEn ? "es" : "en";

  const toggleLanguage = () => i18n.changeLanguage(nextLang);

  if (variant === "drawer") {
    return (
      <>
        <Button
          variant="text"
          fullWidth
          onClick={toggleLanguage}
          startIcon={<Languages className="h-4 w-4" />}
          sx={{
            mb: 0.5,
            borderRadius: 2,
            textTransform: "none",
            color: "var(--color-text-muted)",
            fontWeight: 500,
            justifyContent: "flex-start",
            px: 2,
            py: 1,
            "&:hover": { backgroundColor: "rgba(148, 163, 184, 0.08)" },
          }}
        >
          {isEn ? "Cambiar a Español" : "Switch to English"}
        </Button>

        <Button
          variant="text"
          fullWidth
          onClick={toggleTheme}
          startIcon={theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          sx={{
            mb: 1.5,
            borderRadius: 2,
            textTransform: "none",
            color: "var(--color-text-muted)",
            fontWeight: 500,
            justifyContent: "flex-start",
            px: 2,
            py: 1,
            "&:hover": { backgroundColor: "rgba(148, 163, 184, 0.08)" },
          }}
        >
          {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        </Button>
      </>
    );
  }

  return (
    <>
      <IconButton
        onClick={toggleLanguage}
        color="inherit"
        size="small"
        aria-label="Toggle language"
        sx={{
          color: "var(--color-text-muted)",
          p: 0.75,
          borderRadius: "8px",
          border: "1px solid rgba(148, 163, 184, 0.15)",
        }}
      >
        <div className="flex items-center gap-1 px-0.5">
          <Languages className="h-4 w-4" />
          <span className="text-[10px] font-bold uppercase">{nextLang}</span>
        </div>
      </IconButton>

      <IconButton
        onClick={toggleTheme}
        color="inherit"
        size="small"
        aria-label="Toggle theme"
        sx={{
          color: "var(--color-text-muted)",
          p: 0.75,
          borderRadius: "8px",
          border: "1px solid rgba(148, 163, 184, 0.15)",
        }}
      >
        {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </IconButton>
    </>
  );
}