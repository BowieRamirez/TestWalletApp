/**
 * Error Handler
 *
 * Centralized error handling with typed error codes
 */

export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN = 'UNKNOWN',
}

export class AppError extends Error {
  constructor(message: string, public code: ErrorCode) {
    super(message);
    this.name = 'AppError';
  }
}
