import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

const DEFAULT_TIMEOUT = 30000;

function getEnvironmentBaseURL(): string {
  const env = process.env.NODE_ENV || 'development';

  switch (env) {
    case 'production':
      return process.env.API_BASE_URL || 'https://api.banking.com/v1';
    case 'staging':
      return process.env.API_BASE_URL || 'https://staging-api.banking.com/v1';
    case 'test':
      return process.env.API_BASE_URL || 'http://localhost:3001/v1';
    case 'development':
    default:
      return process.env.API_BASE_URL || 'http://localhost:3000/v1';
  }
}

function getDefaultHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Version': process.env.npm_package_version || '1.0.0',
  };
}

export function createAxiosClient(config?: Partial<ApiClientConfig>): AxiosInstance {
  const axiosConfig: AxiosRequestConfig = {
    baseURL: config?.baseURL || getEnvironmentBaseURL(),
    timeout: config?.timeout || DEFAULT_TIMEOUT,
    headers: {
      ...getDefaultHeaders(),
      ...config?.headers,
    },
    withCredentials: true,
  };

  const client = axios.create(axiosConfig);

  return client;
}

export const axiosClient = createAxiosClient();

export default axiosClient;
