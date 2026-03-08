'use client';

import { Box, alpha } from '@mui/material';
import { ReactNode } from 'react';

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
      }}>
      {/* Left — decorative panel (hidden on mobile) */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
          background: theme =>
            theme.palette.mode === 'dark'
              ? `linear-gradient(135deg, #060A12 0%, #0D1728 100%)`
              : `linear-gradient(135deg, #EEF2FC 0%, #DDEAFF 100%)`,
        }}>
        {/* Grid pattern */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: theme =>
              `linear-gradient(${alpha(theme.palette.primary.main, 0.06)} 1px, transparent 1px),
               linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.06)} 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        {/* Glow orbs */}
        <Box
          sx={{
            position: 'absolute',
            width: 400,
            height: 400,
            borderRadius: '50%',
            top: -100,
            left: -100,
            background: theme => `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            bottom: 100,
            right: -50,
            background: theme => `radial-gradient(circle, ${alpha(theme.palette.primary.light, 0.1)} 0%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
        />

        {/* Content */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box
            sx={{
              display: 'inline-flex',
              px: 1.5,
              py: 0.5,
              borderRadius: '6px',
              border: '1px solid',
              borderColor: theme => alpha(theme.palette.primary.main, 0.3),
              background: theme => alpha(theme.palette.primary.main, 0.08),
              mb: 4,
            }}>
            <Box
              component="span"
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.7rem',
                letterSpacing: '0.12em',
                color: 'primary.light',
              }}>
              ENGINEERING PORTFOLIO
            </Box>
          </Box>

          <Box
            component="h1"
            sx={{
              fontFamily: '"Cabinet Grotesk", "DM Sans", sans-serif',
              fontSize: 'clamp(2rem, 3vw, 3rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              color: 'text.primary',
              m: 0,
              mb: 2,
            }}>
            Sistemas que
            <br />
            <Box
              component="span"
              sx={{
                background: theme => `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
              importam.
            </Box>
          </Box>

          <Box
            component="p"
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '1rem',
              color: 'text.secondary',
              lineHeight: 1.7,
              m: 0,
              maxWidth: 360,
            }}>
            Casos de engenharia reais, decisões técnicas documentadas, e métricas de impacto em sistemas de missão crítica.
          </Box>
        </Box>

        {/* Stats */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 2,
          }}>
          {[
            { value: '70%', label: 'Redução de latência' },
            { value: '3x', label: 'Capacidade de usuários' },
            { value: '0min', label: 'Downtime na migração' },
          ].map(stat => (
            <Box
              key={stat.label}
              sx={{
                p: 2,
                borderRadius: '12px',
                border: '1px solid',
                borderColor: theme => alpha(theme.palette.primary.main, 0.15),
                background: theme => alpha(theme.palette.primary.main, 0.05),
                backdropFilter: 'blur(12px)',
              }}>
              <Box
                sx={{
                  fontFamily: '"Cabinet Grotesk", "DM Sans", sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: 'primary.light',
                  lineHeight: 1,
                  mb: 0.5,
                }}>
                {stat.value}
              </Box>
              <Box
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '0.72rem',
                  color: 'text.secondary',
                  lineHeight: 1.3,
                }}>
                {stat.label}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right — form */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, sm: 6 },
          position: 'relative',
        }}>
        <Box sx={{ width: '100%', maxWidth: 420 }}>{children}</Box>
      </Box>
    </Box>
  );
}
