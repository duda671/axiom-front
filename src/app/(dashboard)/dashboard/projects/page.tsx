'use client';

import { useTranslation } from '@/src/hooks/useTranslation';
import api from '@/src/lib/axios';
import { Add, ArrowForward, FilterList, FolderSpecial, Language, LinkOff, Lock, Search, Star } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import NextLink from 'next/link';
import { useEffect, useMemo, useState } from 'react';

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

type Visibility = 'PUBLIC' | 'PRIVATE' | 'UNLISTED';

interface ProjectItem {
  id: string;
  slug: string;
  published: boolean;
  featured: boolean;
  visibility: Visibility;
  mainImage: string | null;
  updatedAt: string;
  createdAt: string;
  translations: Array<{ locale: string; title: string; summary: string }>;
  techs: Array<{ tech: { id: string; name: string } }>;
  tags: Array<{ tag: { id: string; slug: string } }>;
}

// ─────────────────────────────────────────
// Project Card
// ─────────────────────────────────────────

function ProjectCard({ project, locale }: { project: ProjectItem; locale: string }) {
  const theme = useTheme();
  const translation = project.translations.find(tr => tr.locale === locale.toUpperCase()) ?? project.translations[0];

  const visibilityConfig: Record<Visibility, { label: string; color: string; icon: React.ReactNode }> = {
    PUBLIC: { label: 'Público', color: theme.palette.success.main, icon: <Language sx={{ fontSize: '0.75rem' }} /> },
    PRIVATE: { label: 'Privado', color: theme.palette.error.main, icon: <Lock sx={{ fontSize: '0.75rem' }} /> },
    UNLISTED: { label: 'Não listado', color: theme.palette.warning.main, icon: <LinkOff sx={{ fontSize: '0.75rem' }} /> },
  };
  const vis = visibilityConfig[project.visibility];

  return (
    <Card elevation={0} sx={{ height: '100%' }}>
      <CardActionArea
        component={NextLink}
        href={`/dashboard/projects/${project.id}`}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        {/* Main image */}
        {project.mainImage && (
          <Box
            sx={{
              width: '100%',
              aspectRatio: '16/7',
              overflow: 'hidden',
              background: alpha(theme.palette.primary.main, 0.06),
              flexShrink: 0,
            }}>
            <Box
              component="img"
              src={project.mainImage}
              alt={translation?.title ?? project.slug}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                transition: 'transform 0.3s ease',
                '.MuiCardActionArea-root:hover &': { transform: 'scale(1.03)' },
              }}
            />
          </Box>
        )}

        <CardContent sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Chips row */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
              <Chip
                label={project.published ? 'Publicado' : 'Rascunho'}
                size="small"
                variant="outlined"
                sx={{
                  height: 20,
                  fontSize: '0.62rem',
                  borderColor: project.published ? alpha(theme.palette.success.main, 0.4) : alpha(theme.palette.text.disabled, 0.3),
                  color: project.published ? 'success.main' : 'text.disabled',
                  background: project.published ? alpha(theme.palette.success.main, 0.06) : 'transparent',
                }}
              />
              <Chip
                icon={<Box sx={{ display: 'flex', color: vis.color, ml: '6px !important' }}>{vis.icon}</Box>}
                label={vis.label}
                size="small"
                variant="outlined"
                sx={{
                  height: 20,
                  fontSize: '0.62rem',
                  borderColor: alpha(vis.color, 0.4),
                  color: vis.color,
                  background: alpha(vis.color, 0.06),
                }}
              />
              {project.featured && (
                <Chip
                  icon={<Star sx={{ fontSize: '0.65rem !important', ml: '6px !important' }} />}
                  label="Destaque"
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 20,
                    fontSize: '0.62rem',
                    borderColor: alpha(theme.palette.warning.main, 0.4),
                    color: 'warning.main',
                    background: alpha(theme.palette.warning.main, 0.06),
                  }}
                />
              )}
            </Box>
            <ArrowForward
              sx={{
                fontSize: '0.9rem',
                color: 'text.disabled',
                flexShrink: 0,
                ml: 1,
                transition: 'all 0.15s ease',
                '.MuiCardActionArea-root:hover &': { color: 'primary.main', transform: 'translateX(2px)' },
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '-0.02em',
              mb: 0.75,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
            {translation?.title ?? project.slug}
          </Typography>

          {/* Summary */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: '0.78rem',
              lineHeight: 1.55,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 'auto',
            }}>
            {translation?.summary}
          </Typography>

          {/* Footer */}
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            {project.techs.length > 0 ? (
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
                {project.techs.slice(0, 3).map(({ tech }) => (
                  <Chip key={tech.id} label={tech.name} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.6rem' }} />
                ))}
                {project.techs.length > 3 && (
                  <Chip
                    label={`+${project.techs.length - 3}`}
                    size="small"
                    variant="outlined"
                    sx={{ height: 18, fontSize: '0.6rem', color: 'text.disabled', borderColor: 'divider' }}
                  />
                )}
              </Box>
            ) : (
              <Box />
            )}

            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ fontSize: '0.65rem', flexShrink: 0, fontFamily: '"JetBrains Mono", monospace' }}>
              {new Date(project.updatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

// ─────────────────────────────────────────
// Page
// ─────────────────────────────────────────

type FilterStatus = 'all' | 'published' | 'draft';
type FilterVisibility = 'all' | Visibility;
type SortKey = 'updatedAt' | 'createdAt' | 'title';

export default function ProjectsListPage() {
  const theme = useTheme();
  const { locale } = useTranslation();

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterVisibility, setFilterVisibility] = useState<FilterVisibility>('all');
  const [sort, setSort] = useState<SortKey>('updatedAt');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/projects/admin/all', { params: { limit: 100, locale: locale.toUpperCase() } });
        setProjects(res.data.data.data);
        setTotal(res.data.data.meta.total);
      } catch {
        // silencia
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [locale]);

  const filtered = useMemo(() => {
    let list = [...projects];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => {
        const title = p.translations.find(tr => tr.locale === locale.toUpperCase())?.title ?? p.slug;
        return title.toLowerCase().includes(q) || p.slug.includes(q);
      });
    }

    if (filterStatus === 'published') list = list.filter(p => p.published);
    if (filterStatus === 'draft') list = list.filter(p => !p.published);
    if (filterVisibility !== 'all') list = list.filter(p => p.visibility === filterVisibility);

    list.sort((a, b) => {
      if (sort === 'title') {
        const ta = a.translations.find(tr => tr.locale === locale.toUpperCase())?.title ?? a.slug;
        const tb = b.translations.find(tr => tr.locale === locale.toUpperCase())?.title ?? b.slug;
        return ta.localeCompare(tb);
      }
      return new Date(b[sort]).getTime() - new Date(a[sort]).getTime();
    });

    return list;
  }, [projects, search, filterStatus, filterVisibility, sort, locale]);

  const hasFilters = search || filterStatus !== 'all' || filterVisibility !== 'all';

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, mx: 'auto', width: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.12em', fontSize: '0.65rem' }}>
              Dashboard
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.03em', mt: 0.25 }}>
              Projetos
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {loading ? '...' : `${total} projeto${total !== 1 ? 's' : ''} no total`}
            </Typography>
          </Box>
          <Button
            component={NextLink}
            href="/dashboard/projects/new"
            variant="contained"
            startIcon={<Add />}
            sx={{ flexShrink: 0, display: { xs: 'none', sm: 'flex' } }}>
            Novo projeto
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          mb: 3,
          flexWrap: 'wrap',
          alignItems: 'center',
          p: 2,
          borderRadius: '12px',
          background: alpha(theme.palette.background.paper, 0.6),
          border: `1px solid ${theme.palette.divider}`,
        }}>
        <TextField
          placeholder="Buscar projetos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          size="small"
          sx={{ flex: 1, minWidth: 180 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: '1rem', color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />

        <Select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as FilterStatus)}
          size="small"
          sx={{ minWidth: 130, fontSize: '0.85rem' }}>
          <MenuItem value="all">Todos os status</MenuItem>
          <MenuItem value="published">Publicados</MenuItem>
          <MenuItem value="draft">Rascunhos</MenuItem>
        </Select>

        <Select
          value={filterVisibility}
          onChange={e => setFilterVisibility(e.target.value as FilterVisibility)}
          size="small"
          sx={{ minWidth: 140, fontSize: '0.85rem' }}>
          <MenuItem value="all">Todas visibilidades</MenuItem>
          <MenuItem value="PUBLIC">Público</MenuItem>
          <MenuItem value="PRIVATE">Privado</MenuItem>
          <MenuItem value="UNLISTED">Não listado</MenuItem>
        </Select>

        <Select value={sort} onChange={e => setSort(e.target.value as SortKey)} size="small" sx={{ minWidth: 150, fontSize: '0.85rem' }}>
          <MenuItem value="updatedAt">Atualizado recente</MenuItem>
          <MenuItem value="createdAt">Criado recente</MenuItem>
          <MenuItem value="title">Título A-Z</MenuItem>
        </Select>

        {hasFilters && (
          <Button
            size="small"
            onClick={() => {
              setSearch('');
              setFilterStatus('all');
              setFilterVisibility('all');
            }}
            sx={{ color: 'text.disabled', fontSize: '0.78rem', flexShrink: 0 }}>
            Limpar
          </Button>
        )}
      </Box>

      {/* Results count */}
      {!loading && (
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.72rem' }}>
            {filtered.length === projects.length ? `${filtered.length} projetos` : `${filtered.length} de ${projects.length} projetos`}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.disabled' }}>
            <FilterList sx={{ fontSize: '0.85rem' }} />
            <Typography variant="caption" sx={{ fontSize: '0.72rem' }}>
              {sort === 'updatedAt' ? 'Mais recentes' : sort === 'createdAt' ? 'Mais novos' : 'A-Z'}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Grid */}
      {loading ? (
        <Grid container spacing={2.5}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
              <Skeleton variant="rounded" height={220} />
            </Grid>
          ))}
        </Grid>
      ) : filtered.length === 0 ? (
        <Box
          sx={{
            py: 10,
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
            {hasFilters ? 'Nenhum projeto encontrado para esses filtros' : 'Nenhum projeto ainda'}
          </Typography>
          {hasFilters ? (
            <Button
              size="small"
              onClick={() => {
                setSearch('');
                setFilterStatus('all');
                setFilterVisibility('all');
              }}>
              Limpar filtros
            </Button>
          ) : (
            <Button component={NextLink} href="/dashboard/projects/new" variant="outlined" startIcon={<Add />} size="small">
              Criar primeiro projeto
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          {filtered.map(project => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={project.id}>
              <ProjectCard project={project} locale={locale} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Mobile FAB */}
      <Button
        component={NextLink}
        href="/dashboard/projects/new"
        variant="contained"
        startIcon={<Add />}
        fullWidth
        sx={{ display: { xs: 'flex', sm: 'none' }, mt: 3 }}>
        Novo projeto
      </Button>
    </Box>
  );
}
