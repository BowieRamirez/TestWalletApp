import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '../types/api.types';

export class ApiErrorException extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly details?: Record<string, unknown>;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiErrorException';
    this.statusCode = error.statusCode;
    this.errorCode = error.code;
    this.details = error.details;
  }
}

export function transformErrorResponse(error: AxiosError<unknown>): ApiError {
  const response = error.response;
  const statusCode = response?.status || 0;

  const apiError: ApiError = {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    statusCode,
  };

  if (!response) {
    if (error.code === 'ECONNABORTED') {
      apiError.message = 'Request timeout. Please try again.';
      apiError.code = 'REQUEST_TIMEOUT';
    } else if (error.code === 'ERR_NETWORK') {
      apiError.message = 'Network error. Please check your connection.';
      apiError.code = 'NETWORK_ERROR';
    }
    return apiError;
  }

  const data = response.data as Record<string, unknown> | undefined;

  switch (statusCode) {
    case 400:
      apiError.message = data?.message as string || 'Bad request';
      apiError.code = data?.code as string || 'BAD_REQUEST';
      apiError.details = data?.details as Record<string, unknown>;
      break;

    case 401:
      apiError.message = data?.message as string || 'Unauthorized. Please log in.';
      apiError.code = data?.code as string || 'UNAUTHORIZED';
      break;

    case 403:
      apiError.message = data?.message as string || 'Forbidden. You do not have permission.';
      apiError.code = data?.code as string || 'FORBIDDEN';
      break;

    case 404:
      apiError.message = data?.message as string || 'Resource not found';
      apiError.code = data?.code as string || 'NOT_FOUND';
      break;

    case 409:
      apiError.message = data?.message as string || 'Conflict. Resource already exists.';
      apiError.code = data?.code as string || 'CONFLICT';
      break;

    case 422:
      apiError.message = data?.message as string || 'Validation failed';
      apiError.code = data?.code as string || 'VALIDATION_ERROR';
      apiError.details = data?.details as Record<string, unknown>;
      break;

    case 429:
      apiError.message = data?.message as string || 'Too many requests. Please slow down.';
      apiError.code = data?.code as string || 'RATE_LIMITED';
      break;

    case 500:
      apiError.message = data?.message as string || 'Internal server error';
      apiError.code = data?.code as string || 'INTERNAL_SERVER_ERROR';
      break;

    case 502:
    case 503:
    case 504:
      apiError.message = data?.message as string || 'Service temporarily unavailable';
      apiError.code = data?.code as string || 'SERVICE_UNAVAILABLE';
      break;

    default:
      apiError.message = data?.message as string || `HTTP Error ${statusCode}`;
      apiError.code = data?.code as string || 'HTTP_ERROR';
  }

  return apiError;
}

export function errorResponseInterceptor(error: AxiosError<unknown>): Promise<never> {
  const apiError = transformErrorResponse(error);
  const exception = new ApiErrorException(apiError);

  return Promise.reject(exception);
}

export function successResponseInterceptor(response: AxiosResponse): AxiosResponse {
  return response;
}

export function applyErrorHandlerInterceptor(client: {
  interceptors: {
    response: {
      use: (
        onFulfilled: (response: AxiosResponse) => AxiosResponse,
        onRejected: (error: AxiosError) => Promise<never>
      ) => number;
    };
  };
}): void {
  client.interceptors.response.use(
    successResponseInterceptor,
    errorResponseInterceptor
  );
}
