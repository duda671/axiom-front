import { PaletteMode } from '@mui/material';
import { alpha, createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    glass: {
      surface: string;
      border: string;
    };
  }
  interface PaletteOptions {
    glass?: {
      surface?: string;
      border?: string;
    };
  }
}

const FONT_DISPLAY = '"Cabinet Grotesk", "DM Sans", sans-serif';
const FONT_BODY = '"DM Sans", "Inter", sans-serif';
const FONT_MONO = '"JetBrains Mono", "Fira Code", monospace';

const tokens = {
  dark: {
    bg: {
      default: '#080C14',
      paper: '#0D1320',
      elevated: '#111827',
    },
    text: {
      primary: '#F0F4FF',
      secondary: '#8A9BB5',
      disabled: '#3D4F6B',
    },
    accent: {
      main: '#4F8EF7',
      light: '#7EB0FF',
      dark: '#2563EB',
      contrast: '#FFFFFF',
    },
    border: 'rgba(79, 142, 247, 0.12)',
    glass: {
      surface: 'rgba(13, 19, 32, 0.7)',
      border: 'rgba(79, 142, 247, 0.15)',
    },
  },
  light: {
    bg: {
      default: '#F4F7FE',
      paper: '#FFFFFF',
      elevated: '#EEF2FC',
    },
    text: {
      primary: '#0D1320',
      secondary: '#4A5D7A',
      disabled: '#A0B0C8',
    },
    accent: {
      main: '#2563EB',
      light: '#4F8EF7',
      dark: '#1D4ED8',
      contrast: '#FFFFFF',
    },
    border: 'rgba(37, 99, 235, 0.12)',
    glass: {
      surface: 'rgba(255, 255, 255, 0.7)',
      border: 'rgba(37, 99, 235, 0.15)',
    },
  },
};

export const buildTheme = (mode: PaletteMode) => {
  const t = tokens[mode];

  return createTheme({
    palette: {
      mode,
      primary: {
        main: t.accent.main,
        light: t.accent.light,
        dark: t.accent.dark,
        contrastText: t.accent.contrast,
      },
      background: {
        default: t.bg.default,
        paper: t.bg.paper,
      },
      text: {
        primary: t.text.primary,
        secondary: t.text.secondary,
        disabled: t.text.disabled,
      },
      divider: t.border,
      glass: t.glass,
    },

    typography: {
      fontFamily: FONT_BODY,
      h1: { fontFamily: FONT_DISPLAY, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 },
      h2: { fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15 },
      h3: { fontFamily: FONT_DISPLAY, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
      h4: { fontFamily: FONT_DISPLAY, fontWeight: 600, letterSpacing: '-0.015em' },
      h5: { fontFamily: FONT_DISPLAY, fontWeight: 600, letterSpacing: '-0.01em' },
      h6: { fontFamily: FONT_DISPLAY, fontWeight: 600 },
      body1: { fontFamily: FONT_BODY, lineHeight: 1.7, letterSpacing: '-0.01em' },
      body2: { fontFamily: FONT_BODY, lineHeight: 1.6, letterSpacing: '-0.005em' },
      caption: { fontFamily: FONT_BODY, letterSpacing: '0.02em' },
      overline: { fontFamily: FONT_MONO, letterSpacing: '0.12em', fontSize: '0.65rem' },
      button: { fontFamily: FONT_DISPLAY, fontWeight: 600, letterSpacing: '-0.01em' },
    },

    shape: { borderRadius: 12 },

    shadows: [
      'none',
      mode === 'dark' ? `0 1px 2px rgba(0,0,0,0.4), 0 0 0 1px ${t.border}` : `0 1px 2px rgba(13,19,32,0.06), 0 0 0 1px ${t.border}`,
      mode === 'dark' ? `0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px ${t.border}` : `0 4px 16px rgba(13,19,32,0.08), 0 0 0 1px ${t.border}`,
      mode === 'dark' ? `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${t.border}` : `0 8px 32px rgba(13,19,32,0.1), 0 0 0 1px ${t.border}`,
      mode === 'dark' ? `0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px ${t.border}` : `0 16px 48px rgba(13,19,32,0.12), 0 0 0 1px ${t.border}`,
      ...Array(20).fill('none'),
    ] as any,

    components: {
      MuiCssBaseline: {
        styleOverrides: `
          *, *::before, *::after { box-sizing: border-box; }

          ::selection {
            background: ${alpha(t.accent.main, 0.25)};
            color: ${t.text.primary};
          }

          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb {
            background: ${alpha(t.accent.main, 0.2)};
            border-radius: 100px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: ${alpha(t.accent.main, 0.4)};
          }

          html { scroll-behavior: smooth; }
          body { -webkit-font-smoothing: antialiased; }
        `,
      },

      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 10,
            textTransform: 'none',
            fontWeight: 600,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          },
          contained: {
            background: `linear-gradient(135deg, ${t.accent.main} 0%, ${t.accent.dark} 100%)`,
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: `0 8px 24px ${alpha(t.accent.main, 0.4)}`,
            },
            '&:active': { transform: 'translateY(0)' },
          },
          outlined: {
            borderColor: t.glass.border,
            background: alpha(t.accent.main, 0.04),
            '&:hover': {
              borderColor: t.accent.main,
              background: alpha(t.accent.main, 0.08),
            },
          },
          text: {
            '&:hover': { background: alpha(t.accent.main, 0.08) },
          },
          sizeLarge: { padding: '12px 28px', fontSize: '0.95rem' },
        },
      },

      MuiTextField: {
        defaultProps: { variant: 'outlined' },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              background: mode === 'dark' ? alpha(t.bg.elevated, 0.6) : alpha(t.bg.elevated, 0.8),
              transition: 'all 0.2s ease',
              '& fieldset': { borderColor: t.border },
              '&:hover fieldset': { borderColor: alpha(t.accent.main, 0.4) },
              '&.Mui-focused fieldset': {
                borderColor: t.accent.main,
                borderWidth: 1,
                boxShadow: `0 0 0 3px ${alpha(t.accent.main, 0.12)}`,
              },
            },
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${t.glass.border}`,
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${t.glass.border}`,
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 12px 40px ${alpha(t.accent.main, 0.12)}`,
              borderColor: alpha(t.accent.main, 0.3),
            },
          },
        },
      },

      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontFamily: FONT_MONO,
            fontSize: '0.7rem',
            letterSpacing: '0.04em',
            fontWeight: 500,
          },
          outlined: {
            borderColor: t.glass.border,
            background: alpha(t.accent.main, 0.06),
            color: t.accent.light,
          },
        },
      },

      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            border: '1px solid',
          },
        },
      },

      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 100,
            backgroundColor: alpha(t.accent.main, 0.12),
          },
          bar: {
            background: `linear-gradient(90deg, ${t.accent.main}, ${t.accent.light})`,
            borderRadius: 100,
          },
        },
      },

      MuiDivider: {
        styleOverrides: {
          root: { borderColor: t.border },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            background: mode === 'dark' ? t.bg.elevated : t.bg.paper,
            color: t.text.primary,
            border: `1px solid ${t.border}`,
            borderRadius: 8,
            fontSize: '0.75rem',
            fontFamily: FONT_BODY,
          },
          arrow: {
            color: mode === 'dark' ? t.bg.elevated : t.bg.paper,
          },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            transition: 'all 0.2s ease',
            '&:hover': {
              background: alpha(t.accent.main, 0.1),
              transform: 'scale(1.05)',
            },
          },
        },
      },

      MuiSkeleton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            background: mode === 'dark' ? alpha(t.text.secondary, 0.08) : alpha(t.text.secondary, 0.12),
          },
        },
      },
    },
  });
};
