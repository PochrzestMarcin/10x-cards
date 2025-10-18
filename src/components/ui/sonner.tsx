import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useEffect, useState } from "react";

function useTheme() {
  const [theme, setTheme] = useState("system");
  useEffect(() => {
    // Try to get theme from localStorage, fallback to system
    const storedTheme = typeof window !== "undefined" ? window.localStorage.getItem("theme") : null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      // Optionally, detect system theme
      const prefersDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }
  }, []);
  return { theme };
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
