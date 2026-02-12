import React from "react";
import { Stack } from "expo-router";
import { useThemeColors } from "@/hooks/use-theme-colors";

export default function ModalsLayout() {
  const t = useThemeColors();

  return (
    <Stack
      screenOptions={{
        presentation: "modal",
        animation: "slide_from_bottom",
        headerShadowVisible: false,
        headerStyle: { backgroundColor: t.bg },
        headerTintColor: t.textPrimary,
        contentStyle: { backgroundColor: t.bg },
      }}
    >
      <Stack.Screen
        name="transfer-wizard"
        options={{ title: "Send Money" }}
      />
      <Stack.Screen
        name="receipt"
        options={{ title: "Receipt" }}
      />
    </Stack>
  );
}
