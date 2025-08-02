import React, { createContext, useContext, useState, ReactNode } from "react";

interface ThemeContextType {
  isAcrylicMode: boolean;
  setAcrylicMode: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isAcrylicMode, setAcrylicMode] = useState(false);
  return (
    <ThemeContext.Provider value={{ isAcrylicMode, setAcrylicMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
