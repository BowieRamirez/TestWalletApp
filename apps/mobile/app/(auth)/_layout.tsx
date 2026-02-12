import React from "react";
import { Stack } from "expo-router";
import { useThemeColors } from "@/hooks/use-theme-colors";

export default function AuthLayout() {
  const t = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: t.bg },
      }}
    />
  );
}
