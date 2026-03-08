'use client';

import { useCreateProject, type CreateProjectDto } from '@/src/hooks/project/useProject';
import { Add, ArrowBack } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { ProjectForm } from '../_components/ProjectForm';

export default function NewProjectPage() {
  const router = useRouter();
  const { execute: createProject, loading } = useCreateProject();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleSubmit = async (payload: CreateProjectDto) => {
    try {
      const res = await createProject(payload);
      setSnackbar({ open: true, message: 'Projeto criado com sucesso!', severity: 'success' });
      setTimeout(() => router.push(`/dashboard/projects/${res.data.id}`), 800);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message ?? 'Erro ao criar projeto', severity: 'error' });
    }
  };

  const submitRef = useRef<(() => void) | null>(null);

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, mx: 'auto', width: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          component={NextLink}
          href="/dashboard/projects"
          startIcon={<ArrowBack sx={{ fontSize: '0.9rem' }} />}
          size="small"
          sx={{ color: 'text.disabled', fontSize: '0.8rem', mb: 2, pl: 0 }}>
          Projetos
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.12em', fontSize: '0.65rem' }}>
              Novo projeto
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.03em', mt: 0.25 }}>
              Criar Projeto
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Preencha as informações em ambos os idiomas.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, flexShrink: 0 }}>
            <Button
              component={NextLink}
              href="/dashboard/projects"
              variant="outlined"
              size="small"
              sx={{ display: { xs: 'none', sm: 'flex' } }}>
              Cancelar
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => submitRef.current?.()}
              disabled={loading}
              size="small"
              sx={{ display: { xs: 'none', sm: 'flex' } }}>
              {loading ? 'Criando...' : 'Criar projeto'}
            </Button>
          </Box>
        </Box>
      </Box>

      <ProjectForm
        mode="create"
        loading={loading}
        onSubmit={handleSubmit}
        submitRef={submitRef}
        snackbar={snackbar}
        onCloseSnackbar={() => setSnackbar(prev => ({ ...prev, open: false }))}
      />
    </Box>
  );
}
