// @mybank/ui - Shared Design System
// Components, theme tokens, and utilities for the MyBank mobile app.

// Components
export {
  Button,
  Card,
  Input,
  Badge,
  Avatar,
  BalanceCard,
  TransactionItem,
} from "./components";

export type {
  ButtonProps,
  CardProps,
  InputProps,
  BadgeProps,
  AvatarProps,
  BalanceCardProps,
  TransactionItemProps,
} from "./components";

// Theme
export {
  colors,
  spacing,
  borderRadius,
  fontFamily,
  fontSize,
  fontWeight,
} from "./theme";

export type {
  Colors,
  Spacing,
  BorderRadius,
  FontFamily,
  FontSize,
  FontWeight,
} from "./theme";

// Utilities
export { cn } from "./utils";
