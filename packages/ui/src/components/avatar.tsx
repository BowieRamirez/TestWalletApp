import React from "react";
import { View, Text } from "react-native";
import { cn } from "../utils/cn";

export interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "h-8 w-8 rounded-full",
  md: "h-10 w-10 rounded-full",
  lg: "h-14 w-14 rounded-full",
} as const;

const textSizeStyles = {
  sm: "text-xs font-semibold",
  md: "text-sm font-semibold",
  lg: "text-lg font-semibold",
} as const;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getColorFromName(name: string): string {
  const palette = [
    "bg-indigo-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-purple-500",
    "bg-cyan-500",
    "bg-orange-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

export function Avatar({ name, size = "md", className }: AvatarProps) {
  return (
    <View
      className={cn(
        "items-center justify-center",
        sizeStyles[size],
        getColorFromName(name),
        className
      )}
    >
      <Text className={cn("text-white", textSizeStyles[size])}>
        {getInitials(name)}
      </Text>
    </View>
  );
}
