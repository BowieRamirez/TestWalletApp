/**
 * Shared API
 *
 * Base API configuration and shared API utilities
 */

// Base client
export { apiClient, default } from './base-client';

// Interceptors
export {
  authRequestInterceptor,
  authResponseInterceptor,
} from './interceptors/auth-interceptor';
export { handleApiError, errorResponseInterceptor } from './interceptors/error-interceptor';
export { requestMetadataInterceptor } from './interceptors/request-interceptor';
export { retryInterceptor, setupRetryLogic } from './interceptors/retry-interceptor';

// Error handling
export { AppError, ErrorCode } from './lib/error-handler';

// Types
export type { AppEnv } from '../config/env';
