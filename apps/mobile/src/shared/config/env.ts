/**
 * Environment Configuration
 *
 * Centralized environment variable management with type safety
 */

export type AppEnv = 'development' | 'staging' | 'production';

export const ENV = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.banking.example.com',
  API_VERSION: process.env.EXPO_PUBLIC_API_VERSION || 'v1',
  APP_ENV: (process.env.EXPO_PUBLIC_ENVIRONMENT as AppEnv) || 'development',
  ENABLE_DEV_TOOLS: process.env.EXPO_PUBLIC_ENABLE_DEV_TOOLS === 'true',
  APP_NAME: process.env.EXPO_PUBLIC_APP_NAME || 'BankApp',
  APP_VERSION: process.env.EXPO_PUBLIC_APP_VERSION || '1.0.0',
};

/**
 * Check if running in development environment
 */
export const isDev = (): boolean => ENV.APP_ENV === 'development';

/**
 * Check if running in staging environment
 */
export const isStaging = (): boolean => ENV.APP_ENV === 'staging';

/**
 * Check if running in production environment
 */
export const isProd = (): boolean => ENV.APP_ENV === 'production';

export default ENV;
