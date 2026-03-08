import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error),
);

let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const flushQueue = (token: string | null, error: unknown = null) => {
  pendingQueue.forEach(({ resolve, reject }) => (token ? resolve(token) : reject(error)));
  pendingQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const is401 = error.response?.status === 401;
    const alreadyRetried = original._retry;
    const isRefreshEndpoint = original.url?.includes('/auth/refresh');

    if (!is401 || alreadyRetried || isRefreshEndpoint) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: token => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          },
          reject,
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');

      const { data } = await api.post<{ data: { accessToken: string; refreshToken: string } }>('/auth/refresh', { refreshToken });

      const { accessToken, refreshToken: newRefresh } = data.data;

      setTokens(accessToken, newRefresh);
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

      flushQueue(accessToken);

      original.headers.Authorization = `Bearer ${accessToken}`;
      return api(original);
    } catch (refreshError) {
      flushQueue(null, refreshError);
      clearTokens();
      if (typeof window !== 'undefined') window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

const ACCESS_KEY = '@portfolio:access_token';
const REFRESH_KEY = '@portfolio:refresh_token';
const COOKIE_NAME = 'access_token';

const setCookie = (value: string) => {
  const expires = new Date(Date.now() + 15 * 60 * 1000).toUTCString();
  document.cookie = `${COOKIE_NAME}=${value}; path=/; expires=${expires}; SameSite=Lax`;
};

const deleteCookie = () => {
  document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const getAccessToken = () => (typeof window !== 'undefined' ? localStorage.getItem(ACCESS_KEY) : null);

export const getRefreshToken = () => (typeof window !== 'undefined' ? localStorage.getItem(REFRESH_KEY) : null);

export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
  setCookie(access);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  deleteCookie();
};

export default api;
