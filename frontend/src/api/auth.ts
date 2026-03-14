import axiosInstance from '../utils/axios';
import { useAuthStore } from '../store/authStore';

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  error?: string;
  data?: T;
}

/**
 * 用户注册
 * POST /api/auth/register
 */
export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/register', data);
  return response.data;
};

/**
 * 用户登录
 * POST /api/auth/login
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
  return response.data;
};

/**
 * 退出登录
 * POST /api/auth/logout
 */
export const logout = async (): Promise<{ message: string }> => {
  try {
    await axiosInstance.post<{ message: string }>('/auth/logout');
  } finally {
    // 无论 API 调用是否成功，都清除本地状态
    localStorage.removeItem('auth_token');
    useAuthStore.getState().logout();
  }
  return { message: '退出登录成功' };
};

/**
 * 获取当前用户信息
 * GET /api/auth/me
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await axiosInstance.get<User>('/auth/me');
  return response.data;
};
