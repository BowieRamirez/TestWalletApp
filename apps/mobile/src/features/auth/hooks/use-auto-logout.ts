import { useCallback, useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";
import { useAuthStore } from "../stores/auth-store";

const AUTO_LOGOUT_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Hook that monitors app state and triggers auto-logout
 * when the app has been in background for too long.
 * Satisfies AUTH-001 requirement for auto-logout on background.
 */
export function useAutoLogout() {
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const backgroundTimestamp = useRef<number | null>(null);

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (!isAuthenticated) return;

      if (nextAppState === "background" || nextAppState === "inactive") {
        backgroundTimestamp.current = Date.now();
      } else if (nextAppState === "active" && backgroundTimestamp.current) {
        const elapsed = Date.now() - backgroundTimestamp.current;
        if (elapsed >= AUTO_LOGOUT_TIMEOUT_MS) {
          logout();
        }
        backgroundTimestamp.current = null;
      }
    },
    [isAuthenticated, logout]
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription.remove();
  }, [handleAppStateChange]);
}
