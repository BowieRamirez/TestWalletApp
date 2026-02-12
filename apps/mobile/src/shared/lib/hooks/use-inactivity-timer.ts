/**
 * useInactivityTimer Hook
 *
 * Detects user inactivity and triggers a callback after a timeout period.
 * Useful for auto-locking the app after a period of inactivity.
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export interface UseInactivityTimerOptions {
  /** Timeout duration in milliseconds (default: 5 minutes) */
  timeoutMs?: number;
  /** Callback function when timer expires */
  onTimeout: () => void;
  /** Whether the timer is enabled (default: true) */
  enabled?: boolean;
  /** Reset timer on app foreground (default: true) */
  resetOnForeground?: boolean;
}

export interface UseInactivityTimerReturn {
  /** Time remaining in milliseconds */
  timeRemaining: number;
  /** Whether the timer is currently active */
  isActive: boolean;
  /** Manually reset the timer */
  resetTimer: () => void;
  /** Manually pause the timer */
  pauseTimer: () => void;
  /** Manually resume the timer */
  resumeTimer: () => void;
}

/**
 * Hook to detect user inactivity and trigger a callback
 *
 * @param options - Configuration options
 * @returns Timer state and controls
 *
 * @example
 * function SecureScreen() {
 *   const { timeRemaining, resetTimer } = useInactivityTimer({
 *     timeoutMs: 5 * 60 * 1000, // 5 minutes
 *     onTimeout: () => {
 *       navigation.navigate('LockScreen');
 *     },
 *   });
 *
 *   return (
 *     <TouchableWithoutFeedback onPress={resetTimer}>
 *       <View>
 *         <Text>Time until lock: {Math.ceil(timeRemaining / 1000)}s</Text>
 *       </View>
 *     </TouchableWithoutFeedback>
 *   );
 * }
 */
export function useInactivityTimer(
  options: UseInactivityTimerOptions
): UseInactivityTimerReturn {
  const {
    timeoutMs = 5 * 60 * 1000, // 5 minutes default
    onTimeout,
    enabled = true,
    resetOnForeground = true,
  } = options;

  const [timeRemaining, setTimeRemaining] = useState(timeoutMs);
  const [isActive, setIsActive] = useState(enabled);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    if (!enabled) return;

    lastActivityRef.current = Date.now();
    setTimeRemaining(timeoutMs);
    setIsActive(true);

    clearTimer();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current;
      const remaining = Math.max(0, timeoutMs - elapsed);

      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearTimer();
        setIsActive(false);
        onTimeout();
      }
    }, 1000); // Update every second
  }, [enabled, timeoutMs, onTimeout, clearTimer]);

  const pauseTimer = useCallback(() => {
    clearTimer();
    setIsActive(false);
  }, [clearTimer]);

  const resumeTimer = useCallback(() => {
    if (enabled) {
      resetTimer();
    }
  }, [enabled, resetTimer]);

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      const prevState = appStateRef.current;
      appStateRef.current = nextAppState;

      if (prevState === 'background' && nextAppState === 'active') {
        // App came to foreground
        if (resetOnForeground) {
          resetTimer();
        } else {
          // Check if timeout occurred while in background
          const elapsed = Date.now() - lastActivityRef.current;
          if (elapsed >= timeoutMs) {
            onTimeout();
          } else {
            // Resume with remaining time
            setTimeRemaining(timeoutMs - elapsed);
            if (enabled) {
              resetTimer();
            }
          }
        }
      } else if (nextAppState === 'background') {
        // App went to background - keep the timer running conceptually
        // but we don't need the interval while backgrounded
        clearTimer();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [resetOnForeground, timeoutMs, onTimeout, enabled, resetTimer, clearTimer]);

  // Start timer on mount and when enabled changes
  useEffect(() => {
    if (enabled) {
      resetTimer();
    } else {
      clearTimer();
      setIsActive(false);
    }

    return () => {
      clearTimer();
    };
  }, [enabled, resetTimer, clearTimer]);

  return {
    timeRemaining,
    isActive,
    resetTimer,
    pauseTimer,
    resumeTimer,
  };
}

/**
 * Hook to track user activity and reset inactivity timer
 *
 * @param resetTimer - Function to reset the timer (from useInactivityTimer)
 * @returns Props to spread on touchable components
 *
 * @example
 * function MyScreen() {
 *   const { resetTimer } = useInactivityTimer({ onTimeout: handleTimeout });
 *   const activityProps = useActivityTracking(resetTimer);
 *
 *   return (
 *     <ScrollView {...activityProps}>
 *       <Text>Content</Text>
 *     </ScrollView>
 *   );
 * }
 */
export function useActivityTracking(resetTimer: () => void) {
  return {
    onTouchStart: resetTimer,
    onTouchMove: resetTimer,
    onTouchEnd: resetTimer,
    onScroll: resetTimer,
    onPress: resetTimer,
  };
}
