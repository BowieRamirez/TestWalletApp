import React, { useEffect } from "react";
import { useAutoLogout } from "@/features/auth/hooks/use-auto-logout";

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Auth provider that wraps the app and handles:
 * - Auto-logout on background (AUTH-001)
 * - Token restoration from secure storage
 * - Auth state monitoring
 */
export function AuthProvider({ children }: AuthProviderProps) {
  useAutoLogout();

  useEffect(() => {
    // TODO: Restore token from expo-secure-store on app launch
    // const token = await SecureStore.getItemAsync('auth_token');
    // if (token) { validateAndRestoreSession(token); }
  }, []);

  return <>{children}</>;
}
