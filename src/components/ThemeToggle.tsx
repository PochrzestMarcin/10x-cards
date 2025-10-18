import { useCallback, useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";

// Utility functions for theme management
const getStoredTheme = () => localStorage.getItem("theme");
const setStoredTheme = (theme: "dark" | "light") => localStorage.setItem("theme", theme);

export function ThemeToggle() {
  // Initialize state from document class to avoid hydration mismatch
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });

  // Sync with system changes when no preference is stored
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (!getStoredTheme()) {
        const newTheme = e.matches;
        setIsDark(newTheme);
        document.documentElement.classList.toggle("dark", newTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Handle theme changes
  const toggleTheme = useCallback(() => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    document.documentElement.classList.toggle("dark", newTheme);
    setStoredTheme(newTheme ? "dark" : "light");
  }, [isDark]);

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-4 w-4" />
      <Switch id="theme-toggle" checked={isDark} onCheckedChange={toggleTheme} aria-label="Toggle theme" />
      <Moon className="h-4 w-4" />
    </div>
  );
}
