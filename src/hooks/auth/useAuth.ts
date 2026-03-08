import { AuthUser, useAuthContext } from '@/src/contexts/AuthContext';
import api from '@/src/lib/axios';
import { useState } from 'react';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthContext();

  const execute = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Credenciais inválidas.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register } = useAuthContext();

  const execute = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await register(name, email, password);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao criar conta.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const { logout } = useAuthContext();

  const execute = async () => {
    setLoading(true);
    try {
      await logout();
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading };
};

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const execute = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao enviar e-mail.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, success };
};

export const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const execute = async (token: string, password: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao redefinir senha.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, success };
};

export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<AuthUser | null>(null);
  const { refreshUser } = useAuthContext();

  const execute = async (data: { name?: string; avatarUrl?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.put<{ data: AuthUser }>('/users/me', data);
      setResponse(res.data.data);
      await refreshUser();
      return res.data.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao atualizar perfil.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, response };
};
