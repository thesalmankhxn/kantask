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

export function AppContextProvider(props: React.PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      return savedTheme || "system";
    }
    return "dark"; // Default theme for SSR
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const updateTheme = (value: Theme) => {
    // Only update DOM and localStorage in browser environment
    if (typeof window !== 'undefined') {
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

      localStorage.setItem("theme", value);
    }
    setTheme(value);
  };

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== "system" || typeof window === 'undefined') return;

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
