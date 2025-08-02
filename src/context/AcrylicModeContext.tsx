import React, { createContext, useContext, useState, ReactNode } from "react";

interface AcrylicModeContextType {
  isAcrylicMode: boolean;
  setAcrylicMode: (value: boolean) => void;
}

const AcrylicModeContext = createContext<AcrylicModeContextType | undefined>(undefined);

export const useAcrylicMode = () => {
  const context = useContext(AcrylicModeContext);
  if (!context) throw new Error("useAcrylicMode must be used within AcrylicModeProvider");
  return context;
};

export const AcrylicModeProvider = ({ children }: { children: ReactNode }) => {
  const [isAcrylicMode, setAcrylicMode] = useState(false);
  return (
    <AcrylicModeContext.Provider value={{ isAcrylicMode, setAcrylicMode }}>
      {children}
    </AcrylicModeContext.Provider>
  );
};
