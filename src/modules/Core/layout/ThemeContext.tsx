import React, { createContext, useEffect } from "react";
import type { ReactNode } from "react"; // Type-only import for ReactNode

interface ThemeContextType {
  isDarkMode: boolean;
}

export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: true,
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  useEffect(() => {
    // Enforce dark mode
    document.documentElement.classList.add("dark");
    localStorage.setItem("darkMode", "true");
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode: true }}>
      {children}
    </ThemeContext.Provider>
  );
};