import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme } from "../App";
type ThemeState = {
    theme: Theme;
    toggleTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            theme: "light",
            toggleTheme: (theme) => set({ theme: theme === "dark" ? "light" : "dark" })
        }),
        {
            name: "summitgear-theme"
        },
    ),
)