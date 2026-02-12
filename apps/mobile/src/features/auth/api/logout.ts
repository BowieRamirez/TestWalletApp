import { axiosClient } from '@banking/api';
import { deleteSecureItem } from '@banking/security';
import type { ApiResponse } from '@banking/api';

export interface LogoutResponse {
  success: boolean;
  message: string;
}

/**
 * Logout user
 * POST /auth/logout
 * Clears tokens from storage
 */
export async function logout(): Promise<void> {
  try {
    // Call logout endpoint to invalidate token on server
    await axiosClient.post<ApiResponse<LogoutResponse>>('/auth/logout');
  } catch (error) {
    // Even if server logout fails, we should clear local storage
    console.error('Server logout failed:', error);
  } finally {
    // Clear tokens from secure storage
    await deleteSecureItem('auth_token');
    await deleteSecureItem('refresh_token');
  }
}

/**
 * Logout from all devices
 * Invalidates all sessions for the user
 */
export async function logoutAllDevices(): Promise<void> {
  try {
    await axiosClient.post<ApiResponse<LogoutResponse>>('/auth/logout/all');
  } catch (error) {
    console.error('Server logout all failed:', error);
  } finally {
    // Clear local tokens
    await deleteSecureItem('auth_token');
    await deleteSecureItem('refresh_token');
  }
}
