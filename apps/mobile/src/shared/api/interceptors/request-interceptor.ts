/**
 * Request Interceptor
 *
 * Adds request metadata headers for tracing and debugging
 */

import { InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';

/**
 * Generate a UUID v4
 */
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};

/**
 * Get device information string
 */
const getDeviceInfo = (): string => {
  const platform = Platform.OS;
  const version = Platform.Version;
  return `platform=${platform};version=${version}`;
};

/**
 * Request interceptor - adds metadata headers
 */
export const requestMetadataInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  // Add unique request ID for tracing
  config.headers['X-Request-ID'] = generateUUID();

  // Add timestamp
  config.headers['X-Timestamp'] = new Date().toISOString();

  // Add device information
  config.headers['X-Device-Info'] = getDeviceInfo();

  return config;
};
