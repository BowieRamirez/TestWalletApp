/**
 * @banking/ui
 *
 * Design system primitives for banking applications.
 * Provides theme tokens and reusable UI components.
 */

// ============================================
// Theme Tokens
// ============================================

export {
  // Core tokens
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  animation,
  zIndex,
  breakpoints,
  // Complete theme
  theme,
  // Types
  type Theme,
  type Colors,
  type Spacing,
  type Typography,
} from './theme/tokens';

// ============================================
// Components
// ============================================

// Button
export {
  Button,
  type ButtonProps,
  type ButtonVariant,
  type ButtonSize,
} from './components/button/button';

// Input
export {
  Input,
  type InputProps,
} from './components/input/input';

// Card
export {
  Card,
  type CardProps,
  type CardElevation,
} from './components/card/card';

// ============================================
// Default Exports
// ============================================

export { default as ButtonDefault } from './components/button/button';
export { default as InputDefault } from './components/input/input';
export { default as CardDefault } from './components/card/card';
