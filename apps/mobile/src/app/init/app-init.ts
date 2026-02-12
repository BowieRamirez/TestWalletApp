import { Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { initializeSecurity } from './security-init';

/**
 * App initialization options
 */
export interface AppInitOptions {
  /** Skip font loading (useful for testing) */
  skipFontLoading?: boolean;
  /** Skip security initialization (useful for development) */
  skipSecurityInit?: boolean;
  /** Custom error handler for initialization failures */
  onError?: (error: Error) => void;
}

/**
 * App initialization result
 */
export interface AppInitResult {
  /** Whether initialization was successful */
  success: boolean;
  /** Error if initialization failed */
  error?: Error;
  /** Time taken to initialize in milliseconds */
  duration: number;
}

/**
 * Font loading result
 */
interface FontLoadingResult {
  /** Whether fonts were loaded successfully */
  success: boolean;
  /** Error if font loading failed */
  error?: Error;
}

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch((error) => {
  console.warn('Failed to prevent splash screen auto-hide:', error);
});

/**
 * Load custom fonts
 *
 * Note: This is a placeholder implementation. In a real app, you would:
 * - Import fonts from expo-font or react-native-vector-icons
 * - Load custom font files from assets
 *
 * Example with expo-font:
 * ```typescript
 * import { loadAsync } from 'expo-font';
 * await loadAsync({
 *   'Inter-Regular': require('../../assets/fonts/Inter-Regular.ttf'),
 *   'Inter-Bold': require('../../assets/fonts/Inter-Bold.ttf'),
 * });
 * ```
 */
async function loadFonts(): Promise<FontLoadingResult> {
  try {
    console.log('Loading fonts...');

    // Placeholder: Simulate font loading delay
    // In production, replace with actual font loading logic
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Example implementation (uncomment when fonts are available):
    // await loadAsync({
    //   'Inter-Regular': require('../../assets/fonts/Inter-Regular.ttf'),
    //   'Inter-Medium': require('../../assets/fonts/Inter-Medium.ttf'),
    //   'Inter-SemiBold': require('../../assets/fonts/Inter-SemiBold.ttf'),
    //   'Inter-Bold': require('../../assets/fonts/Inter-Bold.ttf'),
    // });

    console.log('Fonts loaded successfully');
    return { success: true };
  } catch (error) {
    console.error('Font loading error:', error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Failed to load fonts'),
    };
  }
}

/**
 * Hide the splash screen
 */
async function hideSplashScreen(): Promise<void> {
  try {
    await SplashScreen.hideAsync();
    console.log('Splash screen hidden');
  } catch (error) {
    console.warn('Failed to hide splash screen:', error);
  }
}

/**
 * Initialize the application
 *
 * This function handles all app initialization tasks:
 * 1. Load fonts
 * 2. Initialize security features
 * 3. Hide splash screen
 *
 * @param options - Initialization options
 * @returns Promise resolving to initialization result
 *
 * @example
 * ```typescript
 * // In App.tsx or entry point
 * useEffect(() => {
 *   initializeApp()
 *     .then((result) => {
 *       if (result.success) {
 *         console.log('App initialized in', result.duration, 'ms');
 *       } else {
 *         console.error('App initialization failed:', result.error);
 *       }
 *     });
 * }, []);
 * ```
 */
export async function initializeApp(
  options: AppInitOptions = {}
): Promise<AppInitResult> {
  const startTime = Date.now();
  const { skipFontLoading = false, skipSecurityInit = false, onError } = options;

  console.log('Starting app initialization...');
  console.log('Platform:', Platform.OS);

  try {
    // Step 1: Load fonts
    if (!skipFontLoading) {
      const fontResult = await loadFonts();
      if (!fontResult.success && fontResult.error) {
        // Fonts are not critical, log warning but continue
        console.warn('Font loading failed, continuing with system fonts:', fontResult.error);
      }
    }

    // Step 2: Initialize security
    if (!skipSecurityInit) {
      const securityResult = await initializeSecurity();
      if (!securityResult.success) {
        throw securityResult.error || new Error('Security initialization failed');
      }
    }

    // Step 3: Hide splash screen
    await hideSplashScreen();

    const duration = Date.now() - startTime;
    console.log(`App initialization completed in ${duration}ms`);

    return {
      success: true,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    const initError = error instanceof Error ? error : new Error('App initialization failed');

    console.error('App initialization failed:', initError);

    // Call custom error handler if provided
    if (onError) {
      onError(initError);
    }

    // Still try to hide splash screen on error
    await hideSplashScreen();

    return {
      success: false,
      error: initError,
      duration,
    };
  }
}

/**
 * Check if the app is running in development mode
 */
export function isDevelopment(): boolean {
  return __DEV__;
}

/**
 * Check if the app is running on a simulator/emulator
 *
 * Note: This is a placeholder. In production, use react-native-device-info
 * or Platform constants to detect simulator.
 */
export function isSimulator(): boolean {
  // Placeholder implementation
  // In production: return DeviceInfo.isEmulatorSync();
  return false;
}

/**
 * Get app version information
 */
export function getAppVersion(): {
  version: string;
  buildNumber: string;
  bundleIdentifier: string;
} {
  return {
    version: process.env.APP_VERSION || '1.0.0',
    buildNumber: process.env.APP_BUILD_NUMBER || '1',
    bundleIdentifier: Platform.select({
      ios: 'com.banking.app',
      android: 'com.banking.app',
      default: 'com.banking.app',
    }),
  };
}

export default initializeApp;
