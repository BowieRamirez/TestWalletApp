/**
 * Shared Config
 *
 * Application configuration and environment variables
 */

export const config = {
  API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
  APP_NAME: 'BankApp',
  APP_VERSION: '1.0.0',
};
