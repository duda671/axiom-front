import api from '@/src/lib/axios';
import { useState } from 'react';

export type ProjectVisibility = 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
export type Locale = 'PT' | 'EN';

export interface ProjectTranslation {
  locale: Locale;
  title: string;
  summary: string;
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface MetricTranslation {
  locale: Locale;
  label: string;
}

export interface UpsertMetricDto {
  id?: string;
  value: string;
  unit?: string;
  order?: number;
  translations: MetricTranslation[];
}

export interface CreateProjectDto {
  slug: string;
  visibility?: ProjectVisibility;
  published?: boolean;
  featured?: boolean;
  order?: number;
  mainImage?: string;
  translations: ProjectTranslation[];
  techIds?: string[];
  tagIds?: string[];
  metrics?: UpsertMetricDto[];
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}

export interface QueryProjectsDto {
  locale?: Locale;
  tag?: string;
  tech?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface GrantAccessDto {
  userId: string;
}

// ─────────────────────────────────────────

export const useListProjects = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const execute = async (query: QueryProjectsDto = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/projects', { params: query });
      setResponse(res.data);
      return res.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao listar projetos.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, response };
};

export const useListProjectsAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const execute = async (query: QueryProjectsDto = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/projects/admin/all', { params: query });
      setResponse(res.data);
      return res.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao listar projetos.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, response };
};

export const useGetProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const execute = async (slug: string, locale: Locale = 'PT') => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/projects/${slug}`, { params: { locale } });
      setResponse(res.data);
      return res.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao buscar projeto.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, response };
};

export const useCreateProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const execute = async (data: CreateProjectDto) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/projects', data);
      setResponse(res.data);
      return res.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao criar projeto.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, response };
};

export const useUpdateProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const execute = async (id: string, data: UpdateProjectDto) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.put(`/projects/${id}`, data);
      setResponse(res.data);
      return res.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao atualizar projeto.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, response };
};

export const useDeleteProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/projects/${id}`);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao deletar projeto.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export const useGrantProjectAccess = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (projectId: string, data: GrantAccessDto) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(`/projects/${projectId}/access`, data);
      return res.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao conceder acesso.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export const useRevokeProjectAccess = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (projectId: string, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/projects/${projectId}/access/${userId}`);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao revogar acesso.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export const useListProjectAccess = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  const execute = async (projectId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/projects/${projectId}/access`);
      setResponse(res.data);
      return res.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao listar acessos.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error, response };
};
