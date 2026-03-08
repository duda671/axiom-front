import api from '@/src/lib/axios';
import { useState } from 'react';

export interface CreateTechDto {
  name: string;
  iconUrl?: string;
}

export interface UpdateTechDto extends Partial<CreateTechDto> {}

export interface Tech {
  id: string;
  name: string;
  iconUrl: string | null;
  _count?: { projects: number };
}

export const useListTechs = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const execute = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/techs');
      setResponse(res.data);
      return res.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao listar tecnologias.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, response };
};

export const useGetTech = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const execute = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/techs/${id}`);
      setResponse(res.data);
      return res.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao buscar tecnologia.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, response };
};

export const useCreateTech = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const execute = async (data: CreateTechDto) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/techs', data);
      setResponse(res.data);
      return res.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao criar tecnologia.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, response };
};

export const useUpdateTech = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const execute = async (id: string, data: UpdateTechDto) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.put(`/techs/${id}`, data);
      setResponse(res.data);
      return res.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao atualizar tecnologia.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, response };
};

export const useDeleteTech = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/techs/${id}`);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao deletar tecnologia.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};
