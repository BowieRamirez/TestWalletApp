import "../global.css";
import React from "react";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { useThemeStore } from "@/stores/theme-store";

export default function RootLayout() {
  const colorScheme = useThemeStore((s) => s.colorScheme);
  const isDark = colorScheme === "dark";

  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: isDark ? "#000000" : "#F9FAFB" }}
    >
      <QueryProvider>
        <AuthProvider>
          <StatusBar style={isDark ? "light" : "dark"} />
          <Slot />
          <Toaster
            position="top-center"
            richColors
            toastOptions={{
              style: {
                backgroundColor: isDark ? "#1C1C1E" : "#FFFFFF",
                borderColor: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
                borderWidth: 1,
              },
              titleStyle: {
                color: isDark ? "#FFFFFF" : "#111827",
              },
              descriptionStyle: {
                color: "#6A7282",
              },
            }}
          />
        </AuthProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}
