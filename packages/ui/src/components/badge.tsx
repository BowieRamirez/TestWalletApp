import React from "react";
import { View, Text } from "react-native";
import { cn } from "../utils/cn";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
  className?: string;
}

const variantStyles = {
  default: "bg-[#2C2C2E]",
  success: "bg-[#9FE870]/15",
  warning: "bg-amber-500/15",
  danger: "bg-red-500/15",
  info: "bg-blue-500/15",
} as const;

const variantTextStyles = {
  default: "text-white",
  success: "text-[#9FE870]",
  warning: "text-amber-400",
  danger: "text-red-400",
  info: "text-blue-400",
} as const;

const sizeStyles = {
  sm: "px-2 py-0.5 rounded-md",
  md: "px-2.5 py-1 rounded-lg",
} as const;

const sizeTextStyles = {
  sm: "text-xs font-medium",
  md: "text-sm font-medium",
} as const;

export function Badge({
  children,
  variant = "default",
  size = "sm",
  className,
}: BadgeProps) {
  return (
    <View
      className={cn(
        "self-start",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      <Text className={cn(variantTextStyles[variant], sizeTextStyles[size])}>
        {children}
      </Text>
    </View>
  );
}
