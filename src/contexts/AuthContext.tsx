'use client';

import api, { clearTokens, getAccessToken, setTokens } from '@/src/lib/axios';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

export type Role = 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: Role;
  emailVerified: boolean;
  createdAt: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await api.get<{ data: AuthUser }>('/auth/me');
      setUser(data.data);
    } catch {
      setUser(null);
      clearTokens();
    }
  }, []);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      fetchUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await api.post<{
        data: { accessToken: string; refreshToken: string };
      }>('/auth/login', { email, password });

      setTokens(data.data.accessToken, data.data.refreshToken);
      await fetchUser();
    },
    [fetchUser],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { data } = await api.post<{
        data: { accessToken: string; refreshToken: string };
      }>('/auth/register', { name, email, password });

      setTokens(data.data.accessToken, data.data.refreshToken);
      await fetchUser();
    },
    [fetchUser],
  );

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('@portfolio:refresh_token');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } finally {
      clearTokens();
      setUser(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
