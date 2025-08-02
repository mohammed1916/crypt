"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type ThemeMode = "light" | "dark" | "acrylic";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Default to system preference, fallback to "light"
  const getDefaultTheme = (): ThemeMode => {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = window.localStorage.getItem("theme-mode") as ThemeMode | null;
      if (stored === "light" || stored === "dark" || stored === "acrylic") return stored;
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    }
    return "light";
  };

  const [theme, setThemeState] = useState<ThemeMode>(getDefaultTheme());

  useEffect(() => {
    window.localStorage.setItem("theme-mode", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
