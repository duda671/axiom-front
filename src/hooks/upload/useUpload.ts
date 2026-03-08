import api from '@/src/lib/axios';
import { useState } from 'react';

export type UploadFolder = 'projects' | 'avatars' | 'misc';

export interface UploadedFile {
  url: string;
  key: string;
  size: number;
  mimetype: string;
}

export const useUploadFile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<UploadedFile | null>(null);
  const [progress, setProgress] = useState(0);

  const execute = async (file: File, folder: UploadFolder = 'misc'): Promise<UploadedFile> => {
    setLoading(true);
    setError(null);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post<{ data: UploadedFile }>(`/upload?folder=${folder}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: event => {
          if (event.total) {
            setProgress(Math.round((event.loaded * 100) / event.total));
          }
        },
      });

      setResponse(res.data.data);
      return res.data.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao fazer upload.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return { execute, loading, error, response, progress };
};

export const useDeleteFile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (key: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete('/upload', { data: { key } });
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao deletar arquivo.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};
