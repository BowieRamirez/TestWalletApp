import React from "react";
import {
  Pressable,
  Text,
  ActivityIndicator,
  type PressableProps,
} from "react-native";
import { cn } from "../utils/cn";

export interface ButtonProps extends Omit<PressableProps, "children"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  textClassName?: string;
  /** Override colours for theme support */
  colors?: {
    secondaryBg?: string;
    secondaryText?: string;
    outlineBorder?: string;
    outlineText?: string;
    ghostText?: string;
  };
}

const sizeStyles = {
  sm: "px-3 py-2 rounded-2xl",
  md: "px-4 py-3.5 rounded-2xl",
  lg: "px-6 py-4 rounded-2xl",
} as const;

const sizeTextStyles = {
  sm: "text-sm font-medium",
  md: "text-base font-semibold",
  lg: "text-lg font-semibold",
} as const;

export function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  className,
  textClassName,
  colors,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const getBackgroundColor = (pressed: boolean) => {
    switch (variant) {
      case "primary":
        return pressed ? "#7CC84E" : "#9FE870";
      case "secondary":
        return pressed
          ? (colors?.secondaryBg ? undefined : "#2C2C2E")
          : (colors?.secondaryBg ?? "#1C1C1E");
      case "outline":
      case "ghost":
        return pressed ? "rgba(255,255,255,0.05)" : "transparent";
      case "danger":
        return pressed ? "#DC2626" : "#EF4444";
      default:
        return "#9FE870";
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "primary":
        return "#000000";
      case "secondary":
        return colors?.secondaryText ?? "#FFFFFF";
      case "outline":
        return colors?.outlineText ?? "#FFFFFF";
      case "ghost":
        return colors?.ghostText ?? "#FFFFFF";
      case "danger":
        return "#FFFFFF";
      default:
        return "#000000";
    }
  };

  const getBorderStyle = () => {
    if (variant === "outline") {
      return {
        borderWidth: 1,
        borderColor: colors?.outlineBorder ?? "rgba(255,255,255,0.1)",
      };
    }
    return {};
  };

  return (
    <Pressable
      className={cn(
        "flex-row items-center justify-center",
        sizeStyles[size],
        fullWidth && "w-full",
        isDisabled && "opacity-50",
        className
      )}
      style={({ pressed }) => [
        { backgroundColor: getBackgroundColor(pressed) },
        getBorderStyle(),
        typeof style === "function" ? style({ pressed }) : style,
      ]}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? "#000" : "#fff"}
        />
      ) : (
        <Text
          className={cn(sizeTextStyles[size], textClassName)}
          style={{ color: getTextColor() }}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}
