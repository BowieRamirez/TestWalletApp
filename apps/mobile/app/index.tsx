import React from "react";
import { Redirect } from "expo-router";
import { useAuthStore } from "@/features/auth/stores/auth-store";

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/(home)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
