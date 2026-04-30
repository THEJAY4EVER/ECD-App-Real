import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Theme = "light" | "dark" | "system";

type Ctx = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolved: "light" | "dark";
};

const ThemeCtx = createContext<Ctx | null>(null);

function readSystem(): "light" | "dark" {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function apply(resolved: "light" | "dark") {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (resolved === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof localStorage === "undefined") return "system";
    const saved = localStorage.getItem("masuka-theme") as Theme | null;
    return saved && ["light", "dark", "system"].includes(saved) ? saved : "system";
  });
  const [resolved, setResolved] = useState<"light" | "dark">(() =>
    theme === "system" ? readSystem() : theme,
  );

  useEffect(() => {
    const next = theme === "system" ? readSystem() : theme;
    setResolved(next);
    apply(next);
    if (typeof localStorage !== "undefined") localStorage.setItem("masuka-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system" || typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const next = readSystem();
      setResolved(next);
      apply(next);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, setTheme: setThemeState, resolved }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme() {
  const c = useContext(ThemeCtx);
  if (!c) throw new Error("ThemeProvider missing");
  return c;
}
