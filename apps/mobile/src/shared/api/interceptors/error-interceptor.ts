/**
 * Error Interceptor
 *
 * Transforms Axios errors into typed AppError instances
 */

import { AxiosError } from 'axios';
import { AppError, ErrorCode } from '../lib/error-handler';

export const handleApiError = (error: AxiosError): AppError => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        return new AppError('Session expired', ErrorCode.UNAUTHORIZED);
      case 403:
        return new AppError('Access denied', ErrorCode.FORBIDDEN);
      case 404:
        return new AppError('Resource not found', ErrorCode.NOT_FOUND);
      case 500:
        return new AppError('Server error', ErrorCode.SERVER_ERROR);
      default:
        return new AppError('Request failed', ErrorCode.UNKNOWN);
    }
  }
  if (error.request) {
    return new AppError('Network error', ErrorCode.NETWORK_ERROR);
  }
  return new AppError('Unknown error', ErrorCode.UNKNOWN);
};

/**
 * Response error interceptor
 */
export const errorResponseInterceptor = (error: AxiosError): Promise<never> => {
  const appError = handleApiError(error);
  return Promise.reject(appError);
};
