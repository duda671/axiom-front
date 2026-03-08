'use client';

import { AuthShell } from '@/src/components/AuthShell';
import { ThemeToggle } from '@/src/components/ThemeToggle';
import { useRegister } from '@/src/hooks/auth/useAuth';
import { ArrowForward, LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { Alert, Box, Button, IconButton, InputAdornment, Link, TextField, Typography, alpha } from '@mui/material';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const { execute, loading, error } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await execute(form.name, form.email, form.password);
      router.replace('/dashboard');
    } catch {
      // error já está no hook
    }
  };

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Fraca', color: 'error.main', width: '25%' };
    if (p.length < 8) return { label: 'Regular', color: 'warning.main', width: '50%' };
    if (p.length < 12) return { label: 'Boa', color: 'info.main', width: '75%' };
    return { label: 'Forte', color: 'success.main', width: '100%' };
  })();

  return (
    <AuthShell>
      <Box sx={{ position: 'absolute', top: 24, right: 24 }}>
        <ThemeToggle />
      </Box>

      {/* Brand */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
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
          Criar conta
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Preencha os dados para começar.
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
          label="Nome completo"
          value={form.name}
          onChange={handleChange('name')}
          required
          fullWidth
          autoFocus
          placeholder="Seu nome"
          inputProps={{ minLength: 2 }}
        />

        <TextField
          label="E-mail"
          type="email"
          value={form.email}
          onChange={handleChange('email')}
          required
          fullWidth
          autoComplete="email"
          placeholder="seu@email.com"
        />

        <Box>
          <TextField
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange('password')}
            required
            fullWidth
            autoComplete="new-password"
            placeholder="Mínimo 8 caracteres"
            inputProps={{ minLength: 8 }}
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

          {passwordStrength && (
            <Box sx={{ mt: 1, px: 0.5 }}>
              <Box
                sx={{
                  height: 3,
                  borderRadius: 100,
                  bgcolor: 'divider',
                  overflow: 'hidden',
                }}>
                <Box
                  sx={{
                    height: '100%',
                    width: passwordStrength.width,
                    bgcolor: passwordStrength.color,
                    borderRadius: 100,
                    transition: 'all 0.3s ease',
                  }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: passwordStrength.color, mt: 0.5, display: 'block' }}>
                Senha {passwordStrength.label}
              </Typography>
            </Box>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading}
          endIcon={!loading && <ArrowForward />}
          sx={{ mt: 0.5, py: 1.5 }}>
          {loading ? 'Criando conta...' : 'Criar conta'}
        </Button>

        <Typography variant="body2" color="text.secondary" textAlign="center">
          Já tem uma conta?{' '}
          <Link
            component={NextLink}
            href="/login"
            color="primary"
            sx={{ fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Entrar
          </Link>
        </Typography>
      </Box>
    </AuthShell>
  );
}
