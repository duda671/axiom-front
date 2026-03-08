'use client';

import { useAuthContext } from '@/src/contexts/AuthContext';
import { useTranslation } from '@/src/hooks/useTranslation';
import api from '@/src/lib/axios';
import { Add, ArrowForward, FolderSpecial, Memory, Public, Star, TrendingUp } from '@mui/icons-material';
import { Box, Button, Card, CardActionArea, CardContent, Chip, Grid, Skeleton, Typography, alpha, useTheme } from '@mui/material';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';

interface Stats {
  totalProjects: number;
  published: number;
  featured: number;
  techs: number;
}

interface ProjectCard {
  id: string;
  slug: string;
  published: boolean;
  featured: boolean;
  visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
  mainImage: string | null;
  updatedAt: string;
  translations: Array<{ locale: string; title: string; summary: string }>;
  techs: Array<{ tech: { id: string; name: string; iconUrl: string | null } }>;
}

function StatCard({ label, value, icon, accent }: { label: string; value: number | string; icon: React.ReactNode; accent: string }) {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        background: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.6) : theme.palette.background.paper,
        backdropFilter: 'blur(12px)',
        '&:hover': { transform: 'none' }, // override theme card hover
      }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'text.disabled', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
              {label}
            </Typography>
            <Typography
              sx={{
                fontFamily: '"Cabinet Grotesk", "DM Sans", sans-serif',
                fontSize: '2rem',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1.1,
                color: 'text.primary',
                mt: 0.5,
              }}>
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              background: alpha(accent, 0.12),
              border: `1px solid ${alpha(accent, 0.2)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accent,
              flexShrink: 0,
            }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function ProjectItem({ project, locale }: { project: ProjectCard; locale: string }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const translation = project.translations.find(tr => tr.locale === locale.toUpperCase()) ?? project.translations[0];

  const visibilityColor = {
    PUBLIC: theme.palette.success.main,
    PRIVATE: theme.palette.error.main,
    UNLISTED: theme.palette.warning.main,
  }[project.visibility];

  const visibilityLabel = {
    PUBLIC: t('dashboard.public'),
    PRIVATE: t('dashboard.private'),
    UNLISTED: t('dashboard.unlisted'),
  }[project.visibility];

  return (
    <Card elevation={0}>
      <CardActionArea component={NextLink} href={`/dashboard/projects/${project.id}`}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={project.published ? t('dashboard.published') : t('dashboard.draft')}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: project.published ? alpha(theme.palette.success.main, 0.4) : alpha(theme.palette.text.disabled, 0.3),
                  color: project.published ? 'success.main' : 'text.disabled',
                  background: project.published ? alpha(theme.palette.success.main, 0.06) : 'transparent',
                }}
              />
              <Chip
                label={visibilityLabel}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: alpha(visibilityColor, 0.4),
                  color: visibilityColor,
                  background: alpha(visibilityColor, 0.06),
                }}
              />
              {project.featured && (
                <Chip
                  icon={<Star sx={{ fontSize: '0.75rem !important' }} />}
                  label={t('dashboard.featured')}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: alpha(theme.palette.warning.main, 0.4),
                    color: 'warning.main',
                    background: alpha(theme.palette.warning.main, 0.06),
                  }}
                />
              )}
            </Box>

            <ArrowForward
              sx={{
                fontSize: '1rem',
                color: 'text.disabled',
                flexShrink: 0,
                ml: 1,
                transition: 'all 0.15s ease',
                '.MuiCardActionArea-root:hover &': {
                  color: 'primary.main',
                  transform: 'translateX(2px)',
                },
              }}
            />
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: '-0.02em',
              mb: 0.75,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
            {translation?.title ?? project.slug}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: '0.8rem',
              lineHeight: 1.5,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 2,
            }}>
            {translation?.summary}
          </Typography>

          {project.techs.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
              {project.techs.slice(0, 4).map(({ tech }) => (
                <Chip key={tech.id} label={tech.name} size="small" variant="outlined" />
              ))}
              {project.techs.length > 4 && (
                <Chip
                  label={`+${project.techs.length - 4}`}
                  size="small"
                  variant="outlined"
                  sx={{ color: 'text.disabled', borderColor: 'divider' }}
                />
              )}
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default function DashboardPage() {
  const theme = useTheme();
  const { user } = useAuthContext();
  const { t, locale } = useTranslation();

  const [stats, setStats] = useState<Stats | null>(null);
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [projectsRes, techsRes] = await Promise.all([
          api.get('/projects/admin/all', { params: { limit: 6, locale: locale.toUpperCase() } }),
          api.get('/techs'),
        ]);

        const allProjects: ProjectCard[] = projectsRes.data.data.data;
        const allTechs = techsRes.data.data;

        setProjects(allProjects.slice(0, 6));
        setStats({
          totalProjects: projectsRes.data.data.meta.total,
          published: allProjects.filter(p => p.published).length,
          featured: allProjects.filter(p => p.featured).length,
          techs: allTechs.length,
        });
      } catch {
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [locale]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  const greetingEn = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1600, mx: 'auto', width: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.12em', fontSize: '0.65rem' }}>
              {locale === 'pt' ? greeting : greetingEn}, {user?.name?.split(' ')[0]}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.03em', mt: 0.25 }}>
              {t('dashboard.overview')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {t('dashboard.overviewSub')}
            </Typography>
          </Box>

          <Button
            component={NextLink}
            href="/dashboard/projects/new"
            variant="contained"
            startIcon={<Add />}
            sx={{ flexShrink: 0, display: { xs: 'none', sm: 'flex' } }}>
            {t('common.create')}
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      <Grid container spacing={2.5} sx={{ mb: 5 }}>
        {[
          {
            label: t('dashboard.stats.totalProjects'),
            value: stats?.totalProjects ?? 0,
            icon: <FolderSpecial sx={{ fontSize: '1.2rem' }} />,
            accent: theme.palette.primary.main,
          },
          {
            label: t('dashboard.stats.published'),
            value: stats?.published ?? 0,
            icon: <Public sx={{ fontSize: '1.2rem' }} />,
            accent: theme.palette.success.main,
          },
          {
            label: t('dashboard.stats.featured'),
            value: stats?.featured ?? 0,
            icon: <Star sx={{ fontSize: '1.2rem' }} />,
            accent: theme.palette.warning.main,
          },
          {
            label: t('dashboard.stats.techs'),
            value: stats?.techs ?? 0,
            icon: <Memory sx={{ fontSize: '1.2rem' }} />,
            accent: theme.palette.info.main,
          },
        ].map(stat => (
          <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
            {loading ? <Skeleton variant="rounded" height={110} /> : <StatCard {...stat} />}
          </Grid>
        ))}
      </Grid>

      {/* Recent projects */}
      <Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2.5,
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp sx={{ fontSize: '1.1rem', color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
              {t('dashboard.recentProjects')}
            </Typography>
          </Box>
          <Button
            component={NextLink}
            href="/dashboard/projects"
            endIcon={<ArrowForward sx={{ fontSize: '0.9rem' }} />}
            size="small"
            sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
            {t('dashboard.viewAll')}
          </Button>
        </Box>

        {loading ? (
          <Grid container spacing={2}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Grid size={{ xs: 12, md: 6 }} key={i}>
                <Skeleton variant="rounded" height={180} />
              </Grid>
            ))}
          </Grid>
        ) : projects.length === 0 ? (
          <Box
            sx={{
              py: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: '16px',
            }}>
            <FolderSpecial sx={{ fontSize: '2.5rem', color: 'text.disabled' }} />
            <Typography color="text.disabled" variant="body2">
              {t('dashboard.noProjects')}
            </Typography>
            <Button component={NextLink} href="/dashboard/projects/new" variant="outlined" startIcon={<Add />} size="small">
              {t('dashboard.createFirst')}
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {projects.map(project => (
              <Grid size={{ xs: 12, md: 6 }} key={project.id}>
                <ProjectItem project={project} locale={locale} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
