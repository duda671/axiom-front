import api from '@/src/lib/axios';
import { useState } from 'react';

export type Locale = 'PT' | 'EN';

export interface TagTranslationDto {
  locale: Locale;
  name: string;
}

export interface CreateTagDto {
  slug: string;
  translations: TagTranslationDto[];
}

export interface UpdateTagDto {
  slug?: string;
  translations?: TagTranslationDto[];
}

export const useListTags = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const execute = async (locale: Locale = 'PT') => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/tags', { params: { locale } });
      setResponse(res.data);
      return res.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao listar tags.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, response };
};

export const useGetTag = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const execute = async (id: string, locale: Locale = 'PT') => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/tags/${id}`, { params: { locale } });
      setResponse(res.data);
      return res.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao buscar tag.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, response };
};

export const useGetTagBySlug = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const execute = async (slug: string, locale: Locale = 'PT') => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/tags/slug/${slug}`, { params: { locale } });
      setResponse(res.data);
      return res.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao buscar tag.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, response };
};

export const useCreateTag = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const execute = async (data: CreateTagDto) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/tags', data);
      setResponse(res.data);
      return res.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao criar tag.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, response };
};

export const useUpdateTag = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const execute = async (id: string, data: UpdateTagDto) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.put(`/tags/${id}`, data);
      setResponse(res.data);
      return res.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao atualizar tag.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, response };
};

export const useDeleteTag = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/tags/${id}`);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao deletar tag.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};
