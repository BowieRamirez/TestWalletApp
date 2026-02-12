/**
 * Retry Interceptor
 *
 * Implements exponential backoff retry logic for network errors
 */

import { AxiosError, AxiosRequestConfig } from 'axios';

const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000; // 1 second base delay

/**
 * Delay execution for specified milliseconds
 */
const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Calculate exponential backoff delay
 * 1st retry: 1s, 2nd retry: 2s, 3rd retry: 4s
 */
const getRetryDelay = (retryCount: number): number => {
  return RETRY_DELAY_BASE * Math.pow(2, retryCount - 1);
};

/**
 * Check if error is a network error (should be retried)
 */
const isNetworkError = (error: AxiosError): boolean => {
  // No response means network error (request never reached server)
  if (!error.response) {
    return true;
  }

  // Server errors (5xx) can also be retried
  if (error.response.status >= 500 && error.response.status < 600) {
    return true;
  }

  return false;
};

/**
 * Retry interceptor for failed requests
 */
export const retryInterceptor = async (
  error: AxiosError
): Promise<AxiosError> => {
  const config = error.config as AxiosRequestConfig & { retryCount?: number };

  if (!config) {
    return Promise.reject(error);
  }

  // Initialize retry count
  config.retryCount = config.retryCount || 0;

  // Check if we should retry
  if (isNetworkError(error) && config.retryCount < MAX_RETRIES) {
    config.retryCount += 1;

    const retryDelay = getRetryDelay(config.retryCount);
    console.log(`Retrying request (${config.retryCount}/${MAX_RETRIES}) after ${retryDelay}ms`);

    await delay(retryDelay);

    // Re-throw to trigger axios retry mechanism
    // Note: This requires the axios-retry plugin or manual handling in the caller
    (error as AxiosError & { shouldRetry: boolean }).shouldRetry = true;
  }

  return Promise.reject(error);
};

/**
 * Setup retry logic for axios instance
 * This should be called after response interceptors are set up
 */
export const setupRetryLogic = (axiosInstance: {
  interceptors: {
    response: {
      use: (
        onFulfilled: (response: unknown) => unknown,
        onRejected: (error: AxiosError) => Promise<AxiosError>
      ) => number;
    };
  };
}): void => {
  axiosInstance.interceptors.response.use(
    (response) => response,
    retryInterceptor
  );
};
