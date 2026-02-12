import React from "react";
import { View, type ViewProps } from "react-native";
import { cn } from "../utils/cn";

export interface CardProps extends ViewProps {
  variant?: "elevated" | "outlined" | "filled";
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
  /** Override background / border colors for theme support */
  colors?: {
    bg?: string;
    border?: string;
  };
}

const paddingStyles = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
} as const;

export function Card({
  children,
  variant = "elevated",
  padding = "md",
  className,
  style,
  colors,
  ...props
}: CardProps) {
  const bg = colors?.bg ?? "#1C1C1E";
  const borderColor = colors?.border ?? "rgba(255,255,255,0.1)";

  return (
    <View
      className={cn("rounded-2xl", paddingStyles[padding], className)}
      style={[
        { backgroundColor: bg },
        variant === "outlined" && { borderWidth: 1, borderColor },
        variant === "filled" && { backgroundColor: colors?.bg ?? "#2C2C2E" },
        variant === "elevated" && {
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        },
        { borderCurve: "continuous" as const },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
