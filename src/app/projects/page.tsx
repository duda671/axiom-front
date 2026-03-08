'use client';

import { useColorMode } from '@/src/components/ThemeProvider';
import api from '@/src/lib/axios';
import { ArrowForward, DarkMode, Email, GitHub, Language, LightMode, LinkedIn, Search, Star } from '@mui/icons-material';
import { Avatar, Box, Chip, IconButton, InputAdornment, Skeleton, TextField, Tooltip, Typography, alpha, useTheme } from '@mui/material';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';

// ─────────────────────────────────────────
// Constants
// ─────────────────────────────────────────

const CONTACT = {
  github: 'https://github.com/duda671',
  linkedin: 'https://www.linkedin.com/in/maria-eduarda-ara%C3%BAjo-rf/',
  email: 'eduardaaraujorod@gmail.com',
};

const FIRST_NAME = 'Eduarda';

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

type Locale = 'PT' | 'EN';

interface Tech {
  id: string;
  name: string;
  iconUrl: string | null;
  _count?: { projects: number };
}

interface Tag {
  id: string;
  slug: string;
  translations: Array<{ locale: string; name: string }>;
}

interface Project {
  id: string;
  slug: string;
  featured: boolean;
  published: boolean;
  mainImage: string | null;
  updatedAt: string;
  translations: Array<{ locale: string; title: string; summary: string }>;
  techs: Array<{ tech: Tech }>;
  tags: Array<{ tag: Tag }>;
}

// ─────────────────────────────────────────
// Project card
// ─────────────────────────────────────────

function ProjectCard({ project, locale }: { project: Project; locale: Locale }) {
  const theme = useTheme();
  const translation = project.translations.find(t => t.locale === locale) ?? project.translations[0];

  return (
    <Box
      component={NextLink}
      href={`/projects/${project.slug}`}
      sx={{
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        border: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        background: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.5) : theme.palette.background.paper,
        backdropFilter: 'blur(12px)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        '&:hover': {
          borderColor: alpha(theme.palette.primary.main, 0.45),
          transform: 'translateY(-4px)',
          boxShadow: `0 20px 48px ${alpha(theme.palette.primary.main, 0.1)}`,
          '& .card-arrow': {
            transform: 'translate(3px, -3px)',
            color: theme.palette.primary.main,
          },
          '& .card-image': {
            transform: 'scale(1.04)',
          },
        },
      }}>
      {/* Image */}
      <Box
        sx={{
          aspectRatio: '16/9',
          overflow: 'hidden',
          background: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.06) : alpha(theme.palette.primary.main, 0.04),
          position: 'relative',
          flexShrink: 0,
        }}>
        {project.mainImage ? (
          <Box
            className="card-image"
            component="img"
            src={project.mainImage}
            alt={translation?.title ?? ''}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.7rem',
                color: 'text.disabled',
                letterSpacing: '0.12em',
              }}>
              {project.slug}
            </Typography>
          </Box>
        )}

        {project.featured && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1,
              py: 0.375,
              borderRadius: '6px',
              background: alpha('#000', 0.55),
              backdropFilter: 'blur(8px)',
              border: `1px solid ${alpha(theme.palette.warning.main, 0.4)}`,
            }}>
            <Star sx={{ fontSize: '0.65rem', color: 'warning.main' }} />
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.6rem',
                color: 'warning.main',
                letterSpacing: '0.08em',
              }}>
              FEATURED
            </Typography>
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Tags */}
        {project.tags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.5 }}>
            {project.tags.slice(0, 3).map(({ tag }) => {
              const name = tag.translations.find(t => t.locale === locale)?.name ?? tag.slug;
              return (
                <Typography
                  key={tag.id}
                  sx={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.6rem',
                    letterSpacing: '0.08em',
                    color: 'primary.main',
                    textTransform: 'uppercase',
                  }}>
                  #{name}
                </Typography>
              );
            })}
          </Box>
        )}

        {/* Title + arrow */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1 }}>
          <Typography
            sx={{
              fontFamily: '"Cabinet Grotesk", "DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: '-0.025em',
              lineHeight: 1.3,
              color: 'text.primary',
            }}>
            {translation?.title ?? project.slug}
          </Typography>
          <ArrowForward
            className="card-arrow"
            sx={{
              fontSize: '0.9rem',
              color: 'text.disabled',
              flexShrink: 0,
              mt: 0.25,
              transition: 'all 0.2s ease',
            }}
          />
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            fontSize: '0.82rem',
            lineHeight: 1.65,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
            mb: 2,
          }}>
          {translation?.summary}
        </Typography>

        {/* Techs */}
        {project.techs.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.625, flexWrap: 'wrap', mt: 'auto' }}>
            {project.techs.slice(0, 5).map(({ tech }) => (
              <Box
                key={tech.id}
                sx={{
                  px: 1,
                  py: 0.375,
                  borderRadius: '6px',
                  border: `1px solid ${theme.palette.divider}`,
                  background: alpha(theme.palette.background.default, 0.6),
                }}>
                <Typography
                  sx={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.62rem',
                    color: 'text.disabled',
                    letterSpacing: '0.02em',
                  }}>
                  {tech.name}
                </Typography>
              </Box>
            ))}
            {project.techs.length > 5 && (
              <Box
                sx={{
                  px: 1,
                  py: 0.375,
                  borderRadius: '6px',
                  border: `1px solid ${theme.palette.divider}`,
                }}>
                <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.62rem', color: 'text.disabled' }}>
                  +{project.techs.length - 5}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────
// Page
// ─────────────────────────────────────────

export default function PortfolioHomePage() {
  const theme = useTheme();
  const { mode, toggleMode } = useColorMode();

  const [locale, setLocale] = useState<Locale>('PT');
  const [projects, setProjects] = useState<Project[]>([]);
  const [techs, setTechs] = useState<Tech[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState('');
  const [activeTech, setActiveTech] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [projRes, techRes, tagRes] = await Promise.all([
          api.get('/projects', { params: { locale, limit: 100 } }),
          api.get('/techs'),
          api.get('/tags', { params: { locale } }),
        ]);
        setProjects(projRes.data.data.data);
        setTechs(techRes.data.data);
        setTags(tagRes.data.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [locale]);

  const filtered = projects.filter(p => {
    const translation = p.translations.find(t => t.locale === locale) ?? p.translations[0];
    const matchSearch =
      !search ||
      translation?.title.toLowerCase().includes(search.toLowerCase()) ||
      translation?.summary.toLowerCase().includes(search.toLowerCase());
    const matchTech = !activeTech || p.techs.some(({ tech }) => tech.id === activeTech);
    const matchTag = !activeTag || p.tags.some(({ tag }) => tag.id === activeTag);
    return matchSearch && matchTech && matchTag;
  });

  const featured = filtered.filter(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  // top techs (with projects)
  const topTechs = techs.filter(t => projects.some(p => p.techs.some(({ tech }) => tech.id === t.id))).slice(0, 12);

  return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.background.default }}>
      {/* Radial bg */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          background:
            theme.palette.mode === 'dark'
              ? `radial-gradient(ellipse 70% 40% at 60% 0%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 60%)`
              : `radial-gradient(ellipse 70% 40% at 60% 0%, ${alpha(theme.palette.primary.main, 0.055)} 0%, transparent 60%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── NAV ── */}
      <Box
        component="nav"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
          backdropFilter: 'blur(20px)',
          background: alpha(theme.palette.background.default, 0.82),
        }}>
        <Box
          sx={{
            maxWidth: 1100,
            mx: 'auto',
            px: { xs: 3, md: 5 },
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Typography
            sx={{
              fontFamily: '"Cabinet Grotesk", "DM Sans", sans-serif',
              fontWeight: 800,
              fontSize: '1rem',
              letterSpacing: '-0.03em',
              color: 'text.primary',
            }}>
            {FIRST_NAME}
            <Box component="span" sx={{ color: 'primary.main' }}>
              .
            </Box>
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title={CONTACT.github}>
              <IconButton
                component="a"
                href={CONTACT.github}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                <GitHub sx={{ fontSize: '1.05rem' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="LinkedIn">
              <IconButton
                component="a"
                href={CONTACT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{ color: 'text.secondary', '&:hover': { color: '#0A66C2' } }}>
                <LinkedIn sx={{ fontSize: '1.05rem' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={CONTACT.email}>
              <IconButton
                component="a"
                href={`mailto:${CONTACT.email}`}
                size="small"
                sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                <Email sx={{ fontSize: '1.05rem' }} />
              </IconButton>
            </Tooltip>

            <Box sx={{ width: 1, height: 20, bgcolor: 'divider', mx: 0.5 }} />

            {/* Locale */}
            <Box
              onClick={() => setLocale(l => (l === 'PT' ? 'EN' : 'PT'))}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.625,
                px: 1.125,
                py: 0.5,
                borderRadius: '8px',
                border: `1px solid ${theme.palette.divider}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                '&:hover': { borderColor: alpha(theme.palette.primary.main, 0.4) },
              }}>
              <Language sx={{ fontSize: '0.8rem', color: 'text.disabled' }} />
              <Typography
                sx={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.62rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  color: 'text.secondary',
                }}>
                {locale}
              </Typography>
            </Box>

            <IconButton onClick={toggleMode} size="small" sx={{ color: 'text.secondary' }}>
              {mode === 'dark' ? <LightMode sx={{ fontSize: '1rem' }} /> : <DarkMode sx={{ fontSize: '1rem' }} />}
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 3, md: 5 }, position: 'relative', zIndex: 1 }}>
        {/* ── HERO ── */}
        <Box
          sx={{
            pt: { xs: 7, md: 12 },
            pb: { xs: 6, md: 10 },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr auto' },
            gap: { xs: 4, md: 8 },
            alignItems: 'center',
          }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: theme.palette.success.main,
                  boxShadow: `0 0 0 3px ${alpha(theme.palette.success.main, 0.25)}`,
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { boxShadow: `0 0 0 3px ${alpha(theme.palette.success.main, 0.25)}` },
                    '50%': { boxShadow: `0 0 0 6px ${alpha(theme.palette.success.main, 0.08)}` },
                  },
                }}
              />
              <Typography
                sx={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.7rem',
                  color: 'text.disabled',
                  letterSpacing: '0.1em',
                }}>
                {locale === 'PT' ? 'disponível para oportunidades' : 'open to opportunities'}
              </Typography>
            </Box>

            <Typography
              component="h1"
              sx={{
                fontFamily: '"Cabinet Grotesk", "DM Sans", sans-serif',
                fontWeight: 800,
                fontSize: { xs: 'clamp(2.2rem, 9vw, 3.5rem)', md: '3.75rem' },
                letterSpacing: '-0.045em',
                lineHeight: 1.05,
                color: 'text.primary',
                mb: 2.5,
              }}>
              {locale === 'PT' ? 'Olá, eu sou ' : "Hi, I'm "}
              <Box
                component="span"
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                {FIRST_NAME}
              </Box>
            </Typography>

            <Typography
              sx={{
                color: 'text.secondary',
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.75,
                maxWidth: 580,
                fontFamily: '"DM Sans", sans-serif',
                mb: 4,
              }}>
              {locale === 'PT'
                ? 'Desenvolvedora full-stack especializada em sistemas municipais. NestJS, Next.js, PostgreSQL e muito café.'
                : 'Full-stack developer specialized in municipal government systems. NestJS, Next.js, PostgreSQL, and lots of coffee.'}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Box
                component="a"
                href={CONTACT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2.25,
                  py: 1.125,
                  borderRadius: '10px',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  color: '#fff',
                  textDecoration: 'none',
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.45)}`,
                  },
                }}>
                <LinkedIn sx={{ fontSize: '1.1rem' }} />
                LinkedIn
              </Box>
              <Box
                component="a"
                href={CONTACT.github}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2.25,
                  py: 1.125,
                  borderRadius: '10px',
                  border: `1px solid ${theme.palette.divider}`,
                  background: alpha(theme.palette.background.paper, 0.6),
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: alpha(theme.palette.primary.main, 0.4),
                    color: 'text.primary',
                    transform: 'translateY(-2px)',
                  },
                }}>
                <GitHub sx={{ fontSize: '1.1rem' }} />
                GitHub
              </Box>
            </Box>
          </Box>

          {/* Avatar */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            <Box sx={{ position: 'relative' }}>
              <Box
                sx={{
                  position: 'absolute',
                  inset: -16,
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
                  filter: 'blur(16px)',
                }}
              />
              <Avatar
                sx={{
                  width: 160,
                  height: 160,
                  border: `3px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.primary.dark, 0.3)})`,
                  fontSize: '3.5rem',
                  fontWeight: 800,
                  fontFamily: '"Cabinet Grotesk", sans-serif',
                  color: 'primary.main',
                  position: 'relative',
                  boxShadow: `0 24px 64px ${alpha(theme.palette.primary.main, 0.2)}`,
                }}>
                E
              </Avatar>
            </Box>
          </Box>
        </Box>

        {/* ── STACK ── */}
        {topTechs.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <Box
              sx={{
                height: 1,
                background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.5)}, ${theme.palette.divider}, transparent)`,
                mb: 4,
              }}
            />
            <Typography
              variant="overline"
              sx={{ fontSize: '0.62rem', letterSpacing: '0.15em', color: 'text.disabled', display: 'block', mb: 2 }}>
              STACK
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {topTechs.map(tech => (
                <Box
                  key={tech.id}
                  onClick={() => setActiveTech(activeTech === tech.id ? null : tech.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.875,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: '9px',
                    border: `1px solid ${activeTech === tech.id ? alpha(theme.palette.primary.main, 0.5) : theme.palette.divider}`,
                    background:
                      activeTech === tech.id ? alpha(theme.palette.primary.main, 0.08) : alpha(theme.palette.background.paper, 0.5),
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      borderColor: alpha(theme.palette.primary.main, 0.4),
                      background: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}>
                  {tech.iconUrl && (
                    <Box
                      component="img"
                      src={tech.iconUrl}
                      alt={tech.name}
                      sx={{ width: 16, height: 16, objectFit: 'contain' }}
                      onError={(e: any) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <Typography
                    sx={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.72rem',
                      color: activeTech === tech.id ? 'primary.main' : 'text.secondary',
                      fontWeight: activeTech === tech.id ? 600 : 400,
                    }}>
                    {tech.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* ── PROJECTS ── */}
        <Box sx={{ mb: 12 }}>
          {/* Section header + filters */}
          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              mb: 3,
            }}>
            <Box>
              <Typography
                variant="overline"
                sx={{ fontSize: '0.62rem', letterSpacing: '0.15em', color: 'text.disabled', display: 'block' }}>
                {locale === 'PT' ? 'PROJETOS' : 'PROJECTS'}
              </Typography>
              <Typography
                component="h2"
                sx={{
                  fontFamily: '"Cabinet Grotesk", "DM Sans", sans-serif',
                  fontWeight: 800,
                  fontSize: '1.6rem',
                  letterSpacing: '-0.03em',
                  color: 'text.primary',
                }}>
                {locale === 'PT' ? 'Casos de estudo' : 'Case studies'}
              </Typography>
            </Box>

            <TextField
              size="small"
              placeholder={locale === 'PT' ? 'Buscar projeto...' : 'Search project...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ fontSize: '1rem', color: 'text.disabled' }} />
                  </InputAdornment>
                ),
                sx: { fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', borderRadius: '10px' },
              }}
              sx={{ width: { xs: '100%', sm: 240 } }}
            />
          </Box>

          {/* Tag filters */}
          {tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 4 }}>
              <Chip
                label={locale === 'PT' ? 'Todos' : 'All'}
                size="small"
                onClick={() => {
                  setActiveTag(null);
                  setActiveTech(null);
                }}
                variant={!activeTag && !activeTech ? 'filled' : 'outlined'}
                color={!activeTag && !activeTech ? 'primary' : 'default'}
                sx={{ fontSize: '0.72rem' }}
              />
              {tags.map(tag => {
                const name = tag.translations.find(t => t.locale === locale)?.name ?? tag.slug;
                return (
                  <Chip
                    key={tag.id}
                    label={name}
                    size="small"
                    onClick={() => setActiveTag(activeTag === tag.id ? null : tag.id)}
                    variant={activeTag === tag.id ? 'filled' : 'outlined'}
                    color={activeTag === tag.id ? 'primary' : 'default'}
                    sx={{ fontSize: '0.72rem' }}
                  />
                );
              })}
            </Box>
          )}

          {loading ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                gap: 2.5,
              }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="rounded" height={320} sx={{ borderRadius: '16px' }} />
              ))}
            </Box>
          ) : filtered.length === 0 ? (
            <Box
              sx={{
                py: 10,
                textAlign: 'center',
                border: `1px dashed ${theme.palette.divider}`,
                borderRadius: '16px',
              }}>
              <Typography color="text.disabled" variant="body2">
                {locale === 'PT' ? 'Nenhum projeto encontrado.' : 'No projects found.'}
              </Typography>
            </Box>
          ) : (
            <>
              {/* Featured */}
              {featured.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        md: featured.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                      },
                      gap: 2.5,
                    }}>
                    {featured.map(p => (
                      <ProjectCard key={p.id} project={p} locale={locale} />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Rest */}
              {rest.length > 0 && (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                    gap: 2.5,
                  }}>
                  {rest.map(p => (
                    <ProjectCard key={p.id} project={p} locale={locale} />
                  ))}
                </Box>
              )}
            </>
          )}
        </Box>

        {/* ── CONTACT BANNER ── */}
        <Box
          sx={{
            mb: 8,
            p: { xs: 3.5, md: 5 },
            borderRadius: '20px',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            background:
              theme.palette.mode === 'dark'
                ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.background.paper, 0.4)} 100%)`
                : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.04)} 0%, ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
            backdropFilter: 'blur(12px)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 3,
          }}>
          <Box>
            <Typography
              sx={{
                fontFamily: '"Cabinet Grotesk", "DM Sans", sans-serif',
                fontWeight: 800,
                fontSize: { xs: '1.3rem', md: '1.6rem' },
                letterSpacing: '-0.03em',
                color: 'text.primary',
                mb: 0.5,
              }}>
              {locale === 'PT' ? 'Vamos conversar?' : "Let's talk?"}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem' }}>
              {locale === 'PT'
                ? 'Aberta a oportunidades, freelas e colaborações.'
                : 'Open to opportunities, freelance work, and collaborations.'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', flexShrink: 0 }}>
            <Box
              component="a"
              href={`mailto:${CONTACT.email}`}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                px: 2,
                py: 1,
                borderRadius: '10px',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                color: '#fff',
                textDecoration: 'none',
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '0.85rem',
                fontWeight: 600,
                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.35)}`,
                transition: 'all 0.2s ease',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 10px 28px ${alpha(theme.palette.primary.main, 0.45)}` },
              }}>
              <Email sx={{ fontSize: '1rem' }} />
              {CONTACT.email}
            </Box>
          </Box>
        </Box>

        {/* ── FOOTER ── */}
        <Box
          sx={{
            py: 4,
            borderTop: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1,
          }}>
          <Typography
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.68rem',
              color: 'text.disabled',
              letterSpacing: '0.06em',
            }}>
            © {new Date().getFullYear()} {FIRST_NAME}
          </Typography>
          <Typography
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.65rem',
              color: 'text.disabled',
              letterSpacing: '0.04em',
            }}>
            Next.js · MUI · NestJS
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
