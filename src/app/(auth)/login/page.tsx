'use client';

import { AuthShell } from '@/src/components/AuthShell';
import { ThemeToggle } from '@/src/components/ThemeToggle';
import { useLogin } from '@/src/hooks/auth/useAuth';
import { ArrowForward, LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, Box, Button, Divider, IconButton, InputAdornment, Link, TextField, Typography, alpha } from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { execute, loading, error } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await execute(form.email, form.password);
      router.replace('/dashboard');
    } catch {
      // error já está no hook
    }
  };

  return (
    <AuthShell>
      <Box sx={{ position: 'absolute', top: 24, right: 24 }}>
        <ThemeToggle />
      </Box>

      {/* Logo / Brand */}
      <Box sx={{ mb: 5 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 3,
          }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: theme => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: theme => `0 4px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
            }}>
            <LockOutlined sx={{ fontSize: 18, color: '#fff' }} />
          </Box>
          <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: '0.15em' }}>
            PORTFOLIO
          </Typography>
        </Box>

        <Typography variant="h3" sx={{ mb: 1, fontWeight: 800 }}>
          Bem-vindo de volta
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Acesse sua conta para gerenciar os projetos.
        </Typography>
      </Box>

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              borderColor: theme => alpha(theme.palette.error.main, 0.3),
              background: theme => alpha(theme.palette.error.main, 0.06),
            }}>
            {error}
          </Alert>
        )}

        <TextField
          label="E-mail"
          type="email"
          value={form.email}
          onChange={handleChange('email')}
          required
          fullWidth
          autoComplete="email"
          autoFocus
          placeholder="seu@email.com"
        />

        <TextField
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          value={form.password}
          onChange={handleChange('password')}
          required
          fullWidth
          autoComplete="current-password"
          placeholder="••••••••"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(p => !p)} edge="end" size="small" tabIndex={-1}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
          <Link
            component={NextLink}
            href="/forgot-password"
            variant="body2"
            color="primary"
            sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Esqueceu a senha?
          </Link>
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading}
          endIcon={!loading && <ArrowForward />}
          sx={{ mt: 0.5, py: 1.5 }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>

        <Divider sx={{ my: 0.5 }}>
          <Typography variant="caption" color="text.disabled">
            ou
          </Typography>
        </Divider>

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Não tem uma conta?{' '}
          <Link
            component={NextLink}
            href="/register"
            color="primary"
            sx={{ fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Criar conta
          </Link>
        </Typography>
      </Box>
    </AuthShell>
  );
}
