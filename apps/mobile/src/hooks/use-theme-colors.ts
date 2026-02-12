import { useThemeStore } from "@/stores/theme-store";

/**
 * Returns color values based on current theme.
 * Use for inline styles and dynamic color props.
 */
export function useThemeColors() {
  const colorScheme = useThemeStore((s) => s.colorScheme);
  const isDark = colorScheme === "dark";

  return {
    isDark,
    colorScheme,
    // Backgrounds
    bg: isDark ? "#000000" : "#F9FAFB",
    surface: isDark ? "#1C1C1E" : "#FFFFFF",
    surfaceElevated: isDark ? "#2C2C2E" : "#F3F4F6",
    // Text
    textPrimary: isDark ? "#FFFFFF" : "#111827",
    textSecondary: "#6A7282",
    // Borders
    border: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
    borderDashed: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
    // Accent
    accent: "#9FE870",
    // Tab bar
    tabBarBg: isDark ? "rgba(28, 28, 30, 0.95)" : "rgba(255, 255, 255, 0.95)",
    tabBarBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
    // Icons
    iconDefault: isDark ? "#fff" : "#1F2937",
    iconMuted: "#6A7282",
    // Status bar
    statusBarStyle: isDark ? "light" : "dark",
  } as const;
}
