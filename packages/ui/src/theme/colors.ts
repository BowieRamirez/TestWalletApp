/**
 * Design tokens: Color palette
 * Flux dark banking theme — extracted from Figma designs.
 */
export const colors = {
  // Brand — Flux green accent
  primary: {
    50: "#F0FCE9",
    100: "#DFF9D0",
    200: "#C2F4A5",
    300: "#9FE870",
    400: "#9FE870",
    500: "#9FE870",
    600: "#7CC84E",
    700: "#5AA832",
    800: "#3D8820",
    900: "#2A6814",
    950: "#1A480A",
  },
  // Neutral — dark palette
  neutral: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#E5E5E5",
    300: "#D1D5DC",
    400: "#99A1AF",
    500: "#6A7282",
    600: "#525252",
    700: "#364153",
    800: "#1C1C1E",
    900: "#0A0A0A",
    950: "#000000",
  },
  // Semantic
  success: {
    50: "#F0FDF4",
    500: "#9FE870",
    700: "#34D399",
  },
  warning: {
    50: "#FFFBEB",
    500: "#FBBF24",
    700: "#B45309",
  },
  danger: {
    50: "#FEF2F2",
    500: "#FF6467",
    700: "#821A1A",
  },
  info: {
    50: "#EFF6FF",
    500: "#60A5FA",
    700: "#1D4ED8",
  },
  // Background — dark theme
  background: {
    primary: "#000000",
    secondary: "#1C1C1E",
    tertiary: "#2C2C2E",
  },
  // Text — dark theme
  text: {
    primary: "#FFFFFF",
    secondary: "#D1D5DC",
    tertiary: "#6A7282",
    inverse: "#000000",
  },
  // Accent — Flux green
  accent: "#9FE870",
} as const;

export type Colors = typeof colors;
