import React from "react";
import { Stack } from "expo-router";
import { useThemeColors } from "@/hooks/use-theme-colors";

export default function HomeLayout() {
  const t = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        contentStyle: { backgroundColor: t.bg },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
