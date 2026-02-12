/**
 * Base API Client
 *
 * Configured Axios instance with base URL and default headers
 */

import axios, { AxiosInstance } from 'axios';
import { ENV } from '../config/env';

export const apiClient: AxiosInstance = axios.create({
  baseURL: `${ENV.API_BASE_URL}/${ENV.API_VERSION}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default apiClient;
