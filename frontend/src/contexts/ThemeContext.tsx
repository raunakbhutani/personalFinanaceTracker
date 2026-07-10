import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const STORAGE_KEY = "fintrack-theme";

function getStoredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === "dark" ? "dark" : "light";
}

function applyThemeToDOM(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

let listeners: Array<() => void> = [];
let currentTheme: Theme = getStoredTheme();

function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getSnapshot(): Theme {
  return currentTheme;
}

function setThemeGlobal(theme: Theme) {
  currentTheme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
  applyThemeToDOM(theme);
  listeners.forEach((l) => l());
}

applyThemeToDOM(currentTheme);

// Stable actions — never change reference, so Provider won't trigger re-renders
const themeActions = {
  toggleTheme: () => setThemeGlobal(currentTheme === "dark" ? "light" : "dark"),
  setTheme: setThemeGlobal,
};

const ThemeContext = createContext<typeof themeActions | null>(null);

// Provider holds stable value — children do NOT re-render on theme toggle
export function ThemeProvider({ children }: { children: ReactNode }) {
  const value = useMemo(() => themeActions, []);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Only components calling this hook re-render when theme changes
export function useTheme(): ThemeContextType {
  const actions = useContext(ThemeContext);
  if (!actions) throw new Error("useTheme must be used within ThemeProvider");

  const theme = useSyncExternalStore(subscribe, getSnapshot, () => "light" as Theme);

  return useMemo(
    () => ({ theme, toggleTheme: actions.toggleTheme, setTheme: actions.setTheme }),
    [theme, actions]
  );
}
