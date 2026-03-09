'use client';

import { DashboardSidebar } from '@/src/components/dashboard/DashboardSidebar';
import { useAuthContext } from '@/src/contexts/AuthContext';
import { TranslationProvider } from '@/src/hooks/useTranslation';
import { Box, CircularProgress, alpha } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/projects');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme =>
            theme.palette.mode === 'dark' ? 'linear-gradient(135deg, #060A12 0%, #0D1728 100%)' : theme.palette.background.default,
        }}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress size={44} thickness={2} sx={{ color: 'primary.main' }} />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: theme => `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
              filter: 'blur(8px)',
            }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <TranslationProvider>
      <DashboardSidebar>
        <Toaster position="top-right" reverseOrder={true} />

        {children}
      </DashboardSidebar>
    </TranslationProvider>
  );
}
