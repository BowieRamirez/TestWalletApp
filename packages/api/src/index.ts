// Axios client
export {
  createAxiosClient,
  axiosClient,
  type ApiClientConfig,
} from './client/axios-client';

// Error handler interceptors
export {
  ApiErrorException,
  transformErrorResponse,
  errorResponseInterceptor,
  successResponseInterceptor,
  applyErrorHandlerInterceptor,
} from './interceptors/error-handler';

// Auth interceptors
export {
  setTokenStorage,
  authRequestInterceptor,
  createAuthResponseInterceptor,
  applyAuthInterceptors,
  type TokenStorage,
  type RefreshResponse,
} from './interceptors/auth-interceptor';

// Types
export type {
  ApiError,
  PaginationParams,
  PaginatedResponse,
  LoginRequest,
  LoginResponse,
  User,
  Address,
  Account,
  Transaction,
  Counterparty,
  Recipient,
  TransferRequest,
  ExternalRecipient,
  TransferResponse,
  ApiResponse,
} from './types/api.types';
