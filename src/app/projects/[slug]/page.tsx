'use client';

import { useColorMode } from '@/src/components/ThemeProvider';
import { ArrowBack, DarkMode, Language, LightMode } from '@mui/icons-material';
import { Box, Chip, IconButton, Tooltip, Typography, alpha, useTheme } from '@mui/material';
import NextLink from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { type Locale, type Project, getProject } from '@/src/data/projects-data';

// ─────────────────────────────────────────
// Markdown renderer
// ─────────────────────────────────────────

function MarkdownContent({ content }: { content: string }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minWidth: 0,
        overflow: 'hidden',
        '& h1, & h2, & h3, & h4': {
          fontFamily: '"Cabinet Grotesk", "DM Sans", sans-serif',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: 'text.primary',
          mt: 4,
          mb: 1.5,
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
        },
        '& h2': { fontSize: '1.3rem' },
        '& h3': { fontSize: '1.1rem' },
        '& p': {
          color: 'text.secondary',
          lineHeight: 1.8,
          fontSize: '0.95rem',
          mb: 2,
          fontFamily: '"DM Sans", sans-serif',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
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
          maxWidth: '100%',
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
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 2 }}>
      <Box
        sx={{
          width: 3,
          height: 14,
          borderRadius: '2px',
          background: theme => `linear-gradient(180deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          flexShrink: 0,
        }}
      />
      <Typography variant="overline" sx={{ fontSize: '0.65rem', letterSpacing: '0.14em', color: 'text.disabled' }}>
        {children}
      </Typography>
    </Box>
  );
}

// ─────────────────────────────────────────
// STAR block
// ─────────────────────────────────────────

function StarBlock({ label, content, index }: { label: string; content: string; index: number }) {
  const theme = useTheme();
  const accent = [
    theme.palette.primary.main,
    theme.palette.info.main,
    theme.palette.warning.main,
    theme.palette.success.main,
  ][index % 4];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '140px 1fr' },
        gap: { xs: 1, sm: 4 },
        py: 4,
        borderTop: `1px solid ${theme.palette.divider}`,
        '&:first-of-type': { borderTop: 'none', pt: 0 },
        minWidth: 0,
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

      <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
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

// ─────────────────────────────────────────
// Page
// ─────────────────────────────────────────

export default function ProjectPublicPage() {
  const theme = useTheme();
  const params = useParams();
  const router = useRouter();
  const { mode, toggleMode } = useColorMode();
  const slug = params.slug as string;

  const [locale, setLocale] = useState<Locale>('PT');
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [validImages, setValidImages] = useState<string[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const project: Project | undefined = getProject(slug);

  useEffect(() => {
    if (!project) router.replace('/');
  }, [project, router]);

  useEffect(() => {
    if (!project) return;
    const base = `/projects/${project.slug}`;
    const candidates = Array.from({ length: 10 }, (_, i) => `${base}/${i + 1}.png`);
    const checks = candidates.map(
      src =>
        new Promise<string | null>(resolve => {
          const img = new Image();
          img.onload = () => resolve(src);
          img.onerror = () => resolve(null);
          img.src = src;
        })
    );
    Promise.all(checks).then(results => {
      setValidImages(results.filter((s): s is string => s !== null));
      setCarouselIndex(0);
    });
  }, [project]);

  if (!project) return null;

  const translation = project.translations.find(tr => tr.locale === locale) ?? project.translations[0];
  const sortedMetrics = [...project.metrics].sort((a, b) => a.order - b.order);

  const starFields: Array<{ key: keyof typeof translation; labelPt: string; labelEn: string }> = [
    { key: 'situation', labelPt: 'SITUAÇÃO', labelEn: 'SITUATION' },
    { key: 'task', labelPt: 'TAREFA', labelEn: 'TASK' },
    { key: 'action', labelPt: 'AÇÃO', labelEn: 'ACTION' },
    { key: 'result', labelPt: 'RESULTADO', labelEn: 'RESULT' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.background.default, position: 'relative' }}>
      {/* Background */}
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

      {/* Nav */}
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
            href="/"
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
                '&:hover': { borderColor: alpha(theme.palette.primary.main, 0.4), color: 'primary.main' },
              }}>
              <Language sx={{ fontSize: '0.85rem' }} />
              <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em' }}>
                {locale}
              </Typography>
            </Box>

            <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
              <IconButton onClick={toggleMode} size="small" sx={{ color: 'text.secondary' }}>
                {mode === 'dark' ? <LightMode sx={{ fontSize: '1rem' }} /> : <DarkMode sx={{ fontSize: '1rem' }} />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ maxWidth: 1100, mx: 'auto', px: { xs: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
        {/* ── HERO ── */}
        <Box sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 6, md: 8 } }}>
          {/* Tags */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 4 }}>
            {project.tags.map(tag => (
              <Chip
                key={tag.id}
                label={locale === 'PT' ? tag.namePt : tag.nameEn}
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
            ))}
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
              {sortedMetrics.map((metric, i) => (
                <Box
                  key={i}
                  sx={{
                    px: { xs: 2.5, sm: 3.5 },
                    py: { xs: 2.5, sm: 3 },
                    borderRight: i === sortedMetrics.length - 1 ? 'none' : `1px solid ${theme.palette.divider}`,
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
                    {locale === 'PT' ? metric.labelPt : metric.labelEn}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Divider */}
        <Box
          sx={{
            height: 1,
            background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.4)}, ${theme.palette.divider}, transparent)`,
            mb: 8,
          }}
        />

        {/* ── MAIN IMAGE ── */}
        <Box sx={{ mb: 8 }}>
          <SectionLabel>{locale === 'PT' ? 'CAPA' : 'COVER'}</SectionLabel>
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
              onError={(e: any) => { e.currentTarget.parentElement.style.display = 'none'; }}
              sx={{ width: '100%', height: 'auto', display: 'block', maxHeight: 500, objectFit: 'cover' }}
            />
          </Box>
        </Box>

        {/* ── GALERIA ── */}
        {validImages.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <SectionLabel>{locale === 'PT' ? 'GALERIA' : 'GALLERY'}</SectionLabel>

            {/* Carrossel principal */}
            <Box sx={{ position: 'relative', mt: 2 }}>
              <Box
                onClick={() => setActiveImage(validImages[carouselIndex])}
                sx={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: `1px solid ${theme.palette.divider}`,
                  aspectRatio: '16/9',
                  background: alpha(theme.palette.background.paper, 0.5),
                  cursor: 'zoom-in',
                  position: 'relative',
                }}>
                <Box
                  component="img"
                  src={validImages[carouselIndex]}
                  alt={`${translation.title} — ${carouselIndex + 1}`}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.2s ease' }}
                />
                {/* Contador */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 12,
                    right: 12,
                    px: 1,
                    py: 0.375,
                    borderRadius: '6px',
                    background: 'rgba(0,0,0,0.55)',
                    backdropFilter: 'blur(8px)',
                  }}>
                  <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.08em' }}>
                    {carouselIndex + 1} / {validImages.length}
                  </Typography>
                </Box>
                {/* Prev */}
                {carouselIndex > 0 && (
                  <Box
                    onClick={e => { e.stopPropagation(); setCarouselIndex(i => i - 1); }}
                    sx={{
                      position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'background 0.15s',
                      '&:hover': { background: 'rgba(0,0,0,0.75)' },
                    }}>
                    <Typography sx={{ color: '#fff', fontSize: '1rem', lineHeight: 1, userSelect: 'none' }}>‹</Typography>
                  </Box>
                )}
                {/* Next */}
                {carouselIndex < validImages.length - 1 && (
                  <Box
                    onClick={e => { e.stopPropagation(); setCarouselIndex(i => i + 1); }}
                    sx={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'background 0.15s',
                      '&:hover': { background: 'rgba(0,0,0,0.75)' },
                    }}>
                    <Typography sx={{ color: '#fff', fontSize: '1rem', lineHeight: 1, userSelect: 'none' }}>›</Typography>
                  </Box>
                )}
              </Box>

              {/* Thumbnails */}
              {validImages.length > 1 && (
                <Box sx={{ display: 'flex', gap: 1, mt: 1.5, overflowX: 'auto', pb: 0.5 }}>
                  {validImages.map((src, i) => (
                    <Box
                      key={src}
                      onClick={() => setCarouselIndex(i)}
                      sx={{
                        flexShrink: 0,
                        width: 72,
                        height: 48,
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: `2px solid ${i === carouselIndex ? theme.palette.primary.main : theme.palette.divider}`,
                        cursor: 'pointer',
                        opacity: i === carouselIndex ? 1 : 0.55,
                        transition: 'all 0.15s ease',
                        '&:hover': { opacity: 1, borderColor: alpha(theme.palette.primary.main, 0.6) },
                      }}>
                      <Box
                        component="img"
                        src={src}
                        alt={`thumb ${i + 1}`}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* ── STAR ── */}
        <Box sx={{ mb: 8 }}>
          <SectionLabel>{locale === 'PT' ? 'DESAFIOS TÉCNICOS' : 'TECHNICAL CHALLENGES'}</SectionLabel>
          <Box sx={{ mt: 3 }}>
            {starFields.map(({ key, labelPt, labelEn }, i) => (
              <StarBlock
                key={key}
                label={locale === 'PT' ? labelPt : labelEn}
                content={translation[key] as string}
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
              {project.techs.map(tech => (
                <Box
                  key={tech.name}
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
                      onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
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
            <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem', color: 'text.secondary', mt: 0.25 }}>
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
            onClick={(e: any) => e.stopPropagation()}
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