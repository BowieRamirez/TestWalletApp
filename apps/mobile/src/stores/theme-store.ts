import { createStore, useStore } from "zustand";
import { mmkvStorage } from "@/lib/mmkv";

type ColorScheme = "light" | "dark";

interface ThemeState {
  colorScheme: ColorScheme;
}

interface ThemeActions {
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
}

type ThemeStore = ThemeState & ThemeActions;

const THEME_KEY = "app-theme";

function getInitialScheme(): ColorScheme {
  try {
    const stored = mmkvStorage.getString(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // MMKV not available (e.g. Expo Go), default to dark
  }
  return "dark";
}

const themeStore = createStore<ThemeStore>((set, get) => ({
  colorScheme: getInitialScheme(),

  setColorScheme: (scheme) => {
    set({ colorScheme: scheme });
    try {
      mmkvStorage.setString(THEME_KEY, scheme);
    } catch {
      // MMKV not available
    }
  },

  toggleColorScheme: () => {
    const next = get().colorScheme === "dark" ? "light" : "dark";
    get().setColorScheme(next);
  },
}));

export function useThemeStore<T>(selector: (state: ThemeStore) => T): T {
  return useStore(themeStore, selector);
}
