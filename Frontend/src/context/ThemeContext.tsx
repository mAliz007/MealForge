// frontend/src/context/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";

// 1. Define the possible theme values
type Theme = "light" | "dark";

// 2. Define the shape of our context state and actions
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Create the context with undefined initially
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 3. Define the provider props to accept children React nodes
interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Get initial theme from localStorage, safely typed
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    return savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light";
  });

  // Apply the theme attribute to the root HTML document element
  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 4. Custom hook for consuming components
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}