import api from '@/src/lib/axios';
import { useState } from 'react';

export type Role = 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface QueryUsersDto {
  role?: Role;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UpdateRoleDto {
  role: Role;
}

export const useListUsers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const execute = async (query: QueryUsersDto = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/users', { params: query });
      setResponse(res.data);
      return res.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao listar usuários.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, response };
};

export const useGetUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const execute = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/users/${id}`);
      setResponse(res.data);
      return res.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao buscar usuário.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, response };
};

export const useUpdateUserRole = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const execute = async (id: string, data: UpdateRoleDto) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.patch(`/users/${id}/role`, data);
      setResponse(res.data);
      return res.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao atualizar role.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, response };
};

export const useActivateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.patch(`/users/${id}/activate`);
      return res.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao ativar usuário.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export const useDeactivateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.patch(`/users/${id}/deactivate`);
      return res.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao desativar usuário.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/users/${id}`);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao deletar usuário.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};
