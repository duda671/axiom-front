'use client';

import { useColorMode } from '@/src/components/ThemeProvider';
import { ProjectTranslation } from '@/src/hooks/project/useProject';
import api from '@/src/lib/axios';
import { ArrowBack, DarkMode, Language, LightMode } from '@mui/icons-material';
import { Box, Chip, IconButton, Skeleton, Tooltip, Typography, alpha, useTheme } from '@mui/material';
import NextLink from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

type Locale = 'PT' | 'EN';
type Visibility = 'PUBLIC' | 'PRIVATE' | 'UNLISTED';

interface ProjectData {
  id: string;
  slug: string;
  visibility: Visibility;
  published: boolean;
  featured: boolean;
  mainImage: string | null;
  createdAt: string;
  updatedAt: string;
  author: { name: string; avatarUrl: string | null };
  translations: Array<{
    locale: string;
    title: string;
    summary: string;
    situation: string;
    task: string;
    action: string;
    result: string;
  }>;
  techs: Array<{ tech: { id: string; name: string; iconUrl: string | null } }>;
  tags: Array<{ tag: { id: string; slug: string; translations: Array<{ locale: string; name: string }> } }>;
  metrics: Array<{
    id: string;
    value: string;
    unit: string | null;
    order: number;
    translations: Array<{ locale: string; label: string }>;
  }>;
  images: Array<{
    id: string;
    url: string;
    order: number;
    translations: Array<{ locale: string; caption: string | null }>;
  }>;
}

// ─────────────────────────────────────────
// Markdown renderer
// ─────────────────────────────────────────

function MarkdownContent({ content }: { content: string }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        '& h1, & h2, & h3, & h4': {
          fontFamily: '"Cabinet Grotesk", "DM Sans", sans-serif',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: 'text.primary',
          mt: 4,
          mb: 1.5,
        },
        '& h2': { fontSize: '1.3rem' },
        '& h3': { fontSize: '1.1rem' },
        '& p': {
          color: 'text.secondary',
          lineHeight: 1.8,
          fontSize: '0.95rem',
          mb: 2,
          fontFamily: '"DM Sans", sans-serif',
        },
        '& ul, & ol': {
          color: 'text.secondary',
          lineHeight: 1.8,
          fontSize: '0.95rem',
          pl: 2.5,
          mb: 2,
        },
        '& li': { mb: 0.5 },
        '& strong': { color: 'text.primary', fontWeight: 600 },
        '& code': {
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.8rem',
          px: 0.75,
          py: 0.25,
          borderRadius: '5px',
          background: alpha(theme.palette.primary.main, 0.1),
          color: 'primary.light',
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        },
        '& pre': {
          background: theme.palette.mode === 'dark' ? alpha('#000', 0.5) : alpha(theme.palette.background.paper, 0.8),
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '12px',
          p: 2.5,
          overflow: 'auto',
          mb: 3,
          '& code': {
            background: 'none',
            border: 'none',
            p: 0,
            fontSize: '0.82rem',
            color: theme.palette.mode === 'dark' ? '#a8d8ff' : '#1e4070',
          },
        },
        '& blockquote': {
          borderLeft: `3px solid ${theme.palette.primary.main}`,
          pl: 2,
          ml: 0,
          color: 'text.secondary',
          fontStyle: 'italic',
          my: 2,
        },
        '& a': { color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } },
        '& hr': { borderColor: 'divider', my: 3 },
      }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </Box>
  );
}

// ─────────────────────────────────────────
// Section label
// ─────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1,
        mb: 2,
      }}>
      <Box
        sx={{
          width: 3,
          height: 14,
          borderRadius: '2px',
          background: theme => `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          flexShrink: 0,
        }}
      />
      <Typography
        variant="overline"
        sx={{
          fontSize: '0.65rem',
          letterSpacing: '0.14em',
          color: 'text.disabled',
        }}>
        {children}
      </Typography>
    </Box>
  );
}

// ─────────────────────────────────────────
// Star section block
// ─────────────────────────────────────────

function StarBlock({ label, content, index }: { label: string; content: string; index: number }) {
  const theme = useTheme();

  const accent = [theme.palette.primary.main, theme.palette.info.main, theme.palette.warning.main, theme.palette.success.main][index % 4];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '140px 1fr' },
        gap: { xs: 1, sm: 4 },
        py: 4,
        borderTop: `1px solid ${theme.palette.divider}`,
        '&:first-of-type': { borderTop: 'none', pt: 0 },
      }}>
      <Box>
        <Box
          sx={{
            display: 'inline-flex',
            px: 1.25,
            py: 0.5,
            borderRadius: '6px',
            background: alpha(accent, 0.1),
            border: `1px solid ${alpha(accent, 0.25)}`,
          }}>
          <Typography
            variant="overline"
            sx={{
              fontSize: '0.6rem',
              letterSpacing: '0.14em',
              color: accent,
              fontFamily: '"JetBrains Mono", monospace',
            }}>
            {label}
          </Typography>
        </Box>
      </Box>

      <Box>
        {content ? (
          <MarkdownContent content={content} />
        ) : (
          <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic', fontSize: '0.85rem' }}>
            —
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default function ProjectPublicPage() {
  const theme = useTheme();
  const params = useParams();
  const router = useRouter();
  const { mode, toggleMode } = useColorMode();
  const slug = params.slug as string;

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState<Locale>('PT');
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/projects/slug/${slug}`, { params: { locale } });
        setProject(res.data.data);
      } catch {
        router.replace('/');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug, locale]);

  const translation = project?.translations.find(tr => tr.locale === locale) ?? project?.translations[0];

  const sortedMetrics = project?.metrics ? [...project.metrics].sort((a, b) => a.order - b.order) : [];

  const sortedImages = project?.images ? [...project.images].sort((a, b) => a.order - b.order) : [];

  const starFields: Array<{ key: keyof ProjectTranslation; labelPt: string; labelEn: string }> = [
    { key: 'situation', labelPt: 'SITUAÇÃO', labelEn: 'SITUATION' },
    { key: 'task', labelPt: 'TAREFA', labelEn: 'TASK' },
    { key: 'action', labelPt: 'AÇÃO', labelEn: 'ACTION' },
    { key: 'result', labelPt: 'RESULTADO', labelEn: 'RESULT' },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: theme.palette.background.default,
          px: { xs: 3, md: 8 },
          py: 6,
          maxWidth: 900,
          mx: 'auto',
        }}>
        <Skeleton width={80} height={28} sx={{ mb: 4 }} />
        <Skeleton width="70%" height={72} sx={{ mb: 2 }} />
        <Skeleton width="50%" height={28} sx={{ mb: 6 }} />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} height={120} sx={{ mb: 2, borderRadius: 2 }} />
        ))}
      </Box>
    );
  }

  if (!project || !translation) return null;

  return (
    <Box
      sx={{
        minHeight: '100vh',

        background: theme.palette.background.default,
        position: 'relative',
      }}>
      {/* Background texture */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            theme.palette.mode === 'dark'
              ? `radial-gradient(ellipse 80% 50% at 50% -10%, ${alpha(theme.palette.primary.main, 0.12)} 0%, transparent 60%)`
              : `radial-gradient(ellipse 80% 50% at 50% -10%, ${alpha(theme.palette.primary.main, 0.06)} 0%, transparent 60%)`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Sticky nav */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
          backdropFilter: 'blur(20px)',
          background: alpha(theme.palette.background.default, 0.85),
        }}>
        <Box
          sx={{
            width: '100%',
            maxWidth: 1100,
            mx: 'auto',
            px: { xs: 3, md: 4 },
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Box
            component={NextLink}
            href="/projects"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'text.secondary',
              textDecoration: 'none',
              fontSize: '0.8rem',
              fontFamily: '"DM Sans", sans-serif',
              transition: 'color 0.15s',
              '&:hover': { color: 'primary.main' },
            }}>
            <ArrowBack sx={{ fontSize: '0.9rem' }} />
            {locale === 'PT' ? 'Portfólio' : 'Portfolio'}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Locale toggle */}
            <Box
              onClick={() => setLocale(l => (l === 'PT' ? 'EN' : 'PT'))}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                px: 1.25,
                py: 0.5,
                borderRadius: '8px',
                border: `1px solid ${theme.palette.divider}`,
                cursor: 'pointer',
                color: 'text.secondary',
                transition: 'all 0.15s ease',
                '&:hover': {
                  borderColor: alpha(theme.palette.primary.main, 0.4),
                  color: 'primary.main',
                },
              }}>
              <Language sx={{ fontSize: '0.85rem' }} />
              <Typography
                sx={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                }}>
                {locale}
              </Typography>
            </Box>

            {/* Theme toggle */}
            <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
              <IconButton onClick={toggleMode} size="small" sx={{ color: 'text.secondary' }}>
                {mode === 'dark' ? <LightMode sx={{ fontSize: '1rem' }} /> : <DarkMode sx={{ fontSize: '1rem' }} />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box
        sx={{
          maxWidth: 1100,
          mx: 'auto',
          px: { xs: 3, md: 4 },
          position: 'relative',
          zIndex: 1,
        }}>
        {/* ── HERO ── */}
        <Box ref={heroRef} sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 6, md: 8 } }}>
          {/* Tags + techs row */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 4 }}>
            {project.tags.map(({ tag }) => {
              const name = tag.translations.find(tr => tr.locale === locale)?.name ?? tag.slug;
              return (
                <Chip
                  key={tag.id}
                  label={name}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: alpha(theme.palette.primary.main, 0.25),
                    color: 'primary.main',
                    background: alpha(theme.palette.primary.main, 0.06),
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: '0.72rem',
                  }}
                />
              );
            })}
          </Box>

          {/* Title */}
          <Typography
            component="h1"
            sx={{
              fontFamily: '"Cabinet Grotesk", "DM Sans", sans-serif',
              fontSize: { xs: 'clamp(2rem, 8vw, 3rem)', md: '3.25rem' },
              fontWeight: 800,
              letterSpacing: '-0.04em',
              lineHeight: 1.08,
              color: 'text.primary',
              mb: 3,
            }}>
            {translation.title}
          </Typography>

          {/* Summary */}
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.75,
              maxWidth: 680,
              mb: 5,
              fontFamily: '"DM Sans", sans-serif',
            }}>
            {translation.summary}
          </Typography>

          {/* Metrics */}
          {sortedMetrics.length > 0 && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.min(sortedMetrics.length, 4)}, 1fr)`,
                gap: 0,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '14px',
                overflow: 'hidden',
                background: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.5) : theme.palette.background.paper,
                backdropFilter: 'blur(12px)',
              }}>
              {sortedMetrics.map((metric, i) => {
                const label = metric.translations.find(tr => tr.locale === locale)?.label ?? '';
                const isLast = i === sortedMetrics.length - 1;

                return (
                  <Box
                    key={metric.id}
                    sx={{
                      px: { xs: 2.5, sm: 3.5 },
                      py: { xs: 2.5, sm: 3 },
                      borderRight: isLast ? 'none' : `1px solid ${theme.palette.divider}`,
                    }}>
                    <Typography
                      sx={{
                        fontFamily: '"Cabinet Grotesk", "DM Sans", sans-serif',
                        fontSize: { xs: '1.6rem', sm: '2rem' },
                        fontWeight: 800,
                        letterSpacing: '-0.04em',
                        lineHeight: 1,
                        color: 'primary.main',
                        mb: 0.5,
                      }}>
                      {metric.value}
                      {metric.unit && (
                        <Box component="span" sx={{ fontSize: '0.5em', fontWeight: 600, ml: 0.25, color: 'primary.light' }}>
                          {metric.unit}
                        </Box>
                      )}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.disabled',
                        fontSize: '0.68rem',
                        lineHeight: 1.3,
                        display: 'block',
                        fontFamily: '"DM Sans", sans-serif',
                      }}>
                      {label}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>

        {/* ── DIVIDER ── */}
        <Box
          sx={{
            height: 1,
            background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.4)}, ${theme.palette.divider}, transparent)`,
            mb: 8,
          }}
        />

        {/* ── MAIN IMAGE ── */}
        {project.mainImage && (
          <Box sx={{ mb: 8 }}>
            <SectionLabel>{locale === 'PT' ? 'ARQUITETURA DA SOLUÇÃO' : 'SOLUTION ARCHITECTURE'}</SectionLabel>
            <Box
              sx={{
                borderRadius: '16px',
                overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`,
                background: alpha(theme.palette.background.paper, 0.5),
              }}>
              <Box
                component="img"
                src={project.mainImage}
                alt={translation.title}
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  maxHeight: 500,
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Box>
        )}

        {/* ── STAR ── */}
        <Box sx={{ mb: 8 }}>
          <SectionLabel>{locale === 'PT' ? 'DESAFIOS TÉCNICOS' : 'TECHNICAL CHALLENGES'}</SectionLabel>

          <Box sx={{ mt: 3 }}>
            {starFields.map(({ key, labelPt, labelEn }, i) => (
              <StarBlock
                key={key as string}
                label={locale === 'PT' ? labelPt : labelEn}
                content={translation[key as keyof typeof translation] as string}
                index={i}
              />
            ))}
          </Box>
        </Box>

        {/* ── STACK ── */}
        {project.techs.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <SectionLabel>STACK</SectionLabel>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
              {project.techs.map(({ tech }) => (
                <Box
                  key={tech.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1.75,
                    py: 0.875,
                    borderRadius: '10px',
                    border: `1px solid ${theme.palette.divider}`,
                    background: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : theme.palette.background.paper,
                    transition: 'all 0.2s ease',
                    cursor: 'default',
                    '&:hover': {
                      borderColor: alpha(theme.palette.primary.main, 0.4),
                      background: alpha(theme.palette.primary.main, 0.04),
                      transform: 'translateY(-1px)',
                    },
                  }}>
                  {tech.iconUrl && (
                    <Box
                      component="img"
                      src={tech.iconUrl}
                      alt={tech.name}
                      sx={{ width: 18, height: 18, objectFit: 'contain' }}
                      onError={(e: any) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <Typography
                    sx={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '0.78rem',
                      fontWeight: 500,
                      color: 'text.secondary',
                      letterSpacing: '0.01em',
                    }}>
                    {tech.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* ── GALLERY ── */}
        {sortedImages.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <SectionLabel>{locale === 'PT' ? 'GALERIA' : 'GALLERY'}</SectionLabel>

            <Box
              sx={{
                mt: 2,
                display: 'grid',
                gridTemplateColumns: sortedImages.length === 1 ? '1fr' : { xs: '1fr', sm: 'repeat(2, 1fr)' },
                gap: 2,
              }}>
              {sortedImages.map(img => {
                const caption = img.translations.find(tr => tr.locale === locale)?.caption ?? null;

                return (
                  <Box key={img.id}>
                    <Box
                      onClick={() => setActiveImage(img.url)}
                      sx={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: `1px solid ${theme.palette.divider}`,
                        aspectRatio: '16/9',
                        background: alpha(theme.palette.background.paper, 0.5),
                        cursor: 'zoom-in',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: alpha(theme.palette.primary.main, 0.4),
                          transform: 'scale(1.005)',
                        },
                      }}>
                      <Box
                        component="img"
                        src={img.url}
                        alt={caption ?? ''}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </Box>
                    {caption && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 1,
                          color: 'text.disabled',
                          fontSize: '0.7rem',
                          fontStyle: 'italic',
                          textAlign: 'center',
                        }}>
                        {caption}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}

        {/* ── FOOTER ── */}
        <Box
          sx={{
            py: 6,
            borderTop: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}>
          <Box>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}>
              {locale === 'PT' ? 'ATUALIZADO EM' : 'UPDATED AT'}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.75rem',
                color: 'text.secondary',
                mt: 0.25,
              }}>
              {new Date(project.updatedAt).toLocaleDateString(locale === 'PT' ? 'pt-BR' : 'en-US', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </Typography>
          </Box>

          <Box
            component={NextLink}
            href="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'text.secondary',
              textDecoration: 'none',
              fontSize: '0.8rem',
              fontFamily: '"DM Sans", sans-serif',
              px: 2,
              py: 1,
              borderRadius: '8px',
              border: `1px solid ${theme.palette.divider}`,
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: alpha(theme.palette.primary.main, 0.4),
                color: 'primary.main',
                background: alpha(theme.palette.primary.main, 0.04),
              },
            }}>
            <ArrowBack sx={{ fontSize: '0.9rem' }} />
            {locale === 'PT' ? 'Voltar ao portfólio' : 'Back to portfolio'}
          </Box>
        </Box>
      </Box>

      {/* Lightbox */}
      {activeImage && (
        <Box
          onClick={() => setActiveImage(null)}
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
            p: 4,
          }}>
          <Box
            component="img"
            src={activeImage}
            onClick={e => e.stopPropagation()}
            sx={{
              maxWidth: '100%',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '12px',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
              cursor: 'default',
            }}
          />
        </Box>
      )}
    </Box>
  );
}
