'use client';

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
type AppContextValues = {
  theme: Theme;
  updateTheme: (theme: Theme) => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
};

const AppContext = createContext<AppContextValues>({} as AppContextValues);

/**
 * Safely accesses localStorage with SSR compatibility
 * @returns The stored theme or default theme
 */
const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark';

  try {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    return storedTheme || 'dark';
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return 'dark';
  }
};

export function AppContextProvider(props: React.PropsWithChildren) {
  // Initialize theme state with a default value
  const [theme, setTheme] = useState<Theme>('dark');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Load theme from localStorage after component mounts
  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  const updateTheme = (value: Theme) => {
    const htmlElement = document.documentElement;

    if (value === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      if (systemTheme === "dark") {
        htmlElement.classList.add("dark");
      } else {
        htmlElement.classList.remove("dark");
      }
    } else if (value === "dark") {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }

    setTheme(value);

    // Safely store theme in localStorage
    try {
      localStorage.setItem("theme", value);
    } catch (error) {
      console.error('Error saving theme to localStorage:', error);
    }
  };

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (mediaQuery.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    handleChange(); // Initial check
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return (
    <AppContext.Provider
      value={{ theme, updateTheme, isSearchOpen, openSearch, closeSearch }}
    >
      {props.children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext should be used within AppContextProvider");
  }

  return context;
}
