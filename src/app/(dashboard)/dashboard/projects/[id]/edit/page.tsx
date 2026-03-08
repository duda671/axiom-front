'use client';

import { useUpdateProject, type CreateProjectDto, type ProjectTranslation } from '@/src/hooks/project/useProject';
import { useTranslation } from '@/src/hooks/useTranslation';
import api from '@/src/lib/axios';
import { ArrowBack, Save } from '@mui/icons-material';
import { Box, Button, Skeleton, Typography } from '@mui/material';
import NextLink from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ProjectForm, type Visibility } from '../../_components/ProjectForm';

interface ProjectData {
  id: string;
  slug: string;
  visibility: Visibility;
  published: boolean;
  featured: boolean;
  translations: ProjectTranslation[];
}

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { locale } = useTranslation();
  const { execute: updateProject, loading } = useUpdateProject();

  const id = params.id as string;

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const submitRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        console.log(res.data.data);
        setProject(res.data.data);
      } catch {
        router.replace('/dashboard/projects');
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (payload: CreateProjectDto) => {
    try {
      await updateProject(id, payload);
      setSnackbar({ open: true, message: 'Projeto atualizado com sucesso!', severity: 'success' });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message ?? 'Erro ao atualizar projeto', severity: 'error' });
    }
  };

  if (loadingData) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
        <Skeleton variant="text" width={120} height={28} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={220} height={48} sx={{ mb: 4 }} />
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Skeleton variant="rounded" width={280} height={400} sx={{ flexShrink: 0 }} />
          <Skeleton variant="rounded" sx={{ flex: 1 }} height={500} />
        </Box>
      </Box>
    );
  }

  if (!project) return null;

  const currentTranslation = project.translations.find(t => t.locale === locale.toUpperCase()) ?? project.translations[0];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, mx: 'auto', width: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          component={NextLink}
          href={`/dashboard/projects/${id}`}
          startIcon={<ArrowBack sx={{ fontSize: '0.9rem' }} />}
          size="small"
          sx={{ color: 'text.disabled', fontSize: '0.8rem', mb: 2, pl: 0 }}>
          {currentTranslation?.title ?? project.slug}
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.12em', fontSize: '0.65rem' }}>
              Editar projeto
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.03em', mt: 0.25 }}>
              {currentTranslation?.title ?? project.slug}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, fontFamily: '"JetBrains Mono", monospace', fontSize: '0.72rem' }}>
              /projects/{project.slug}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0 }}>
            <Button
              component={NextLink}
              href={`/dashboard/projects/${id}`}
              variant="outlined"
              size="small"
              sx={{ display: { xs: 'none', sm: 'flex' } }}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={() => submitRef.current?.()}
              disabled={loading}
              size="small"
              sx={{ display: { xs: 'none', sm: 'flex' } }}>
              {loading ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </Box>
        </Box>
      </Box>

      <ProjectForm
        mode="edit"
        initialValues={{
          slug: project.slug,
          visibility: project.visibility,
          published: project.published,
          featured: project.featured,
          translations: project.translations,
        }}
        loading={loading}
        onSubmit={handleSubmit}
        submitRef={submitRef}
        snackbar={snackbar}
        onCloseSnackbar={() => setSnackbar(prev => ({ ...prev, open: false }))}
      />
    </Box>
  );
}
