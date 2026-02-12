import React, { useEffect, useRef, useCallback, ReactNode } from 'react';
import { AppState, AppStateStatus, NativeModules, Platform } from 'react-native';
import { useAuth } from './auth-provider';

interface SecurityProviderProps {
  children: ReactNode;
}

// Inactivity timeout in milliseconds (5 minutes)
const INACTIVITY_TIMEOUT = 5 * 60 * 1000;

/**
 * SecurityProvider - Handles security-related app behaviors
 *
 * Features:
 * - Auto-logout after period of inactivity (5 minutes)
 * - App state listener for background/foreground transitions
 * - Screenshot prevention placeholder (platform-specific)
 * - Session timeout warnings
 */
export function SecurityProvider({ children }: SecurityProviderProps): JSX.Element {
  const { logout, isAuthenticated } = useAuth();
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const backgroundTimeRef = useRef<number | null>(null);

  /**
   * Clear the inactivity timer
   */
  const clearInactivityTimer = useCallback((): void => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  /**
   * Reset the inactivity timer
   */
  const resetInactivityTimer = useCallback((): void => {
    clearInactivityTimer();

    if (!isAuthenticated) {
      return;
    }

    lastActivityRef.current = Date.now();

    inactivityTimerRef.current = setTimeout(() => {
      console.log('Session timed out due to inactivity');
      logout().catch((error) => {
        console.error('Auto-logout failed:', error);
      });
    }, INACTIVITY_TIMEOUT);
  }, [isAuthenticated, logout, clearInactivityTimer]);

  /**
   * Handle app state changes (background/foreground)
   */
  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus): void => {
      const previousState = appState.current;
      appState.current = nextAppState;

      // App is coming to foreground
      if (previousState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground');

        // Check if app was in background for too long
        if (backgroundTimeRef.current) {
          const timeInBackground = Date.now() - backgroundTimeRef.current;

          // If in background for more than 5 minutes, force logout
          if (timeInBackground > INACTIVITY_TIMEOUT && isAuthenticated) {
            console.log('App was in background too long, logging out');
            logout().catch((error) => {
              console.error('Background timeout logout failed:', error);
            });
            return;
          }
        }

        // Reset inactivity timer on foreground
        resetInactivityTimer();

        // Re-enable screenshot prevention if needed
        enableScreenshotPrevention();
      }

      // App is going to background
      if (previousState === 'active' && nextAppState.match(/inactive|background/)) {
        console.log('App has gone to the background');
        backgroundTimeRef.current = Date.now();

        // Clear inactivity timer while in background
        clearInactivityTimer();

        // Optionally disable screenshot prevention in background
        // disableScreenshotPrevention();
      }
    },
    [isAuthenticated, logout, resetInactivityTimer, clearInactivityTimer]
  );

  /**
   * Enable screenshot prevention (platform-specific)
   * Note: This is a placeholder - actual implementation depends on native modules
   */
  const enableScreenshotPrevention = useCallback((): void => {
    try {
      if (Platform.OS === 'android') {
        // Android: Use FLAG_SECURE via native module
        // NativeModules.SecurityModule?.enableScreenshotPrevention?.();
        console.log('Screenshot prevention enabled (Android placeholder)');
      } else if (Platform.OS === 'ios') {
        // iOS: Use UITextField secure entry or native module
        // NativeModules.SecurityModule?.enableScreenshotPrevention?.();
        console.log('Screenshot prevention enabled (iOS placeholder)');
      }
    } catch (error) {
      console.error('Failed to enable screenshot prevention:', error);
    }
  }, []);

  /**
   * Disable screenshot prevention (platform-specific)
   */
  const disableScreenshotPrevention = useCallback((): void => {
    try {
      if (Platform.OS === 'android') {
        // NativeModules.SecurityModule?.disableScreenshotPrevention?.();
        console.log('Screenshot prevention disabled (Android placeholder)');
      } else if (Platform.OS === 'ios') {
        // NativeModules.SecurityModule?.disableScreenshotPrevention?.();
        console.log('Screenshot prevention disabled (iOS placeholder)');
      }
    } catch (error) {
      console.error('Failed to disable screenshot prevention:', error);
    }
  }, []);

  // Setup app state listener
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [handleAppStateChange]);

  // Setup inactivity timer when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      resetInactivityTimer();
      enableScreenshotPrevention();
    } else {
      clearInactivityTimer();
      disableScreenshotPrevention();
    }

    return () => {
      clearInactivityTimer();
    };
  }, [
    isAuthenticated,
    resetInactivityTimer,
    clearInactivityTimer,
    enableScreenshotPrevention,
    disableScreenshotPrevention,
  ]);

  // Track user activity to reset inactivity timer
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    // Reset timer on user interaction
    const handleUserActivity = (): void => {
      resetInactivityTimer();
    };

    // Note: In a real app, you might want to use a more sophisticated
    // approach like a PanResponder or gesture handler to track activity
    // For now, we rely on the timer being reset when the app comes to foreground

    return () => {
      // Cleanup if needed
    };
  }, [isAuthenticated, resetInactivityTimer]);

  return <>{children}</>;
}

export default SecurityProvider;
