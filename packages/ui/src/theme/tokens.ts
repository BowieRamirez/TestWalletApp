/**
 * Design Tokens for Banking Application
 *
 * A comprehensive design system providing consistent styling
 * across the banking application.
 */

// ============================================
// Color Palette
// ============================================

export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#E6F0FF',
    100: '#CCE0FF',
    200: '#99C2FF',
    300: '#66A3FF',
    400: '#3385FF',
    500: '#0066FF', // Main primary
    600: '#0052CC',
    700: '#003D99',
    800: '#002966',
    900: '#001433',
  },

  // Secondary Accent Colors
  secondary: {
    50: '#F0E6FF',
    100: '#E0CCFF',
    200: '#C299FF',
    300: '#A366FF',
    400: '#8533FF',
    500: '#6600FF', // Main secondary
    600: '#5200CC',
    700: '#3D0099',
    800: '#290066',
    900: '#140033',
  },

  // Success States
  success: {
    50: '#E6F9ED',
    100: '#CCF3DB',
    200: '#99E7B7',
    300: '#66DB93',
    400: '#33CF6F',
    500: '#00C34B', // Main success
    600: '#009C3C',
    700: '#00752D',
    800: '#004E1E',
    900: '#00270F',
  },

  // Error States
  error: {
    50: '#FEE6E6',
    100: '#FDCCCC',
    200: '#FB9999',
    300: '#F96666',
    400: '#F73333',
    500: '#F50000', // Main error
    600: '#C40000',
    700: '#930000',
    800: '#620000',
    900: '#310000',
  },

  // Warning States
  warning: {
    50: '#FFF8E6',
    100: '#FFF1CC',
    200: '#FFE399',
    300: '#FFD566',
    400: '#FFC733',
    500: '#FFB900', // Main warning
    600: '#CC9400',
    700: '#996F00',
    800: '#664A00',
    900: '#332500',
  },

  // Neutral Palette (Grays)
  neutral: {
    0: '#FFFFFF',
    50: '#F7F8F9',
    100: '#EEF0F2',
    200: '#D1D5DB',
    300: '#9CA3AF',
    400: '#6B7280',
    500: '#4B5563',
    600: '#374151',
    700: '#1F2937',
    800: '#111827',
    900: '#0B0F19',
  },

  // Semantic Aliases
  background: '#FFFFFF',
  surface: '#F7F8F9',
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  border: '#D1D5DB',
  divider: '#EEF0F2',
} as const;

// ============================================
// Spacing Scale
// ============================================

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// ============================================
// Typography
// ============================================

export const typography = {
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
  },

  // Font Weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Line Heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
  },
} as const;

// ============================================
// Border Radius
// ============================================

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
} as const;

// ============================================
// Shadows
// ============================================

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// ============================================
// Animation
// ============================================

export const animation = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeInOut: 'ease-in-out',
    easeOut: 'ease-out',
    easeIn: 'ease-in',
  },
} as const;

// ============================================
// Z-Index Scale
// ============================================

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
} as const;

// ============================================
// Breakpoints (for responsive design)
// ============================================

export const breakpoints = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
} as const;

// ============================================
// Complete Theme Export
// ============================================

export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  animation,
  zIndex,
  breakpoints,
} as const;

export type Theme = typeof theme;
export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Typography = typeof typography;
