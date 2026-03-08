'use client';

import { useDeleteProject, useUpdateProject } from '@/src/hooks/project/useProject';
import { useTranslation } from '@/src/hooks/useTranslation';
import api from '@/src/lib/axios';
import {
  ArrowBack,
  Close,
  Delete,
  Edit,
  FolderSpecial,
  Language,
  LinkOff,
  Lock,
  Memory,
  MoreVert,
  OpenInNew,
  Public,
  Save,
  Star,
  Tag,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Snackbar,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import NextLink from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Visibility = 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
type LocaleTab = 'PT' | 'EN';

interface ProjectData {
  id: string;
  slug: string;
  visibility: Visibility;
  published: boolean;
  featured: boolean;
  order: number;
  mainImage: string | null;
  createdAt: string;
  updatedAt: string;
  author: { id: string; name: string; email: string; avatarUrl: string | null };
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

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
      <Box sx={{ color: 'primary.main', display: 'flex', '& svg': { fontSize: '1rem' } }}>{icon}</Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
        {title}
      </Typography>
    </Box>
  );
}

function StarField({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Box>
      <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        {label}
      </Typography>
      {value ? (
        <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.85rem', lineHeight: 1.65, color: 'text.primary' }}>
          {value}
        </Typography>
      ) : (
        <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.82rem', color: 'text.disabled', fontStyle: 'italic' }}>
          {hint}
        </Typography>
      )}
    </Box>
  );
}

export default function ProjectViewPage() {
  const theme = useTheme();
  const params = useParams();
  const router = useRouter();
  const { locale } = useTranslation();
  const { execute: updateProject } = useUpdateProject();
  const { execute: deleteProject, loading: deleting } = useDeleteProject();

  const id = params.id as string;

  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [localeTab, setLocaleTab] = useState<LocaleTab>('PT');
  const [editingSlug, setEditingSlug] = useState(false);
  const [slugValue, setSlugValue] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        setProject(res.data.data);
        setSlugValue(res.data.data.slug);
      } catch {
        router.replace('/dashboard/projects');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const showSnack = (message: string, severity: 'success' | 'error' = 'success') => setSnackbar({ open: true, message, severity });

  const handleToggle = async (field: 'published' | 'featured') => {
    if (!project) return;
    const newVal = !project[field];
    setProject(prev => (prev ? { ...prev, [field]: newVal } : prev));
    try {
      await updateProject(id, { [field]: newVal });
      showSnack(
        field === 'published' ? (newVal ? 'Publicado' : 'Despublicado') : newVal ? 'Marcado como destaque' : 'Removido do destaque',
      );
    } catch {
      setProject(prev => (prev ? { ...prev, [field]: !newVal } : prev));
      showSnack('Erro ao atualizar', 'error');
    }
  };

  const handleSaveSlug = async () => {
    if (!project || slugValue === project.slug) {
      setEditingSlug(false);
      return;
    }
    try {
      await updateProject(id, { slug: slugValue });
      setProject(prev => (prev ? { ...prev, slug: slugValue } : prev));
      setEditingSlug(false);
      showSnack('Slug atualizado');
    } catch {
      showSnack('Erro ao atualizar slug', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProject(id);
      router.replace('/dashboard/projects');
    } catch {
      showSnack('Erro ao deletar projeto', 'error');
      setDeleteDialog(false);
    }
  };

  const visibilityMap: Record<Visibility, { label: string; color: string; icon: React.ReactNode }> = {
    PUBLIC: { label: 'Público', color: theme.palette.success.main, icon: <Language sx={{ fontSize: '0.85rem' }} /> },
    PRIVATE: { label: 'Privado', color: theme.palette.error.main, icon: <Lock sx={{ fontSize: '0.85rem' }} /> },
    UNLISTED: { label: 'Não listado', color: theme.palette.warning.main, icon: <LinkOff sx={{ fontSize: '0.85rem' }} /> },
  };

  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
        <Skeleton variant="text" width={120} height={28} sx={{ mb: 2 }} />
        <Skeleton variant="text" width={280} height={48} sx={{ mb: 1 }} />
        <Skeleton variant="text" width={200} height={24} sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 4, lg: 3 }}>
            <Skeleton variant="rounded" height={300} />
          </Grid>
          <Grid size={{ xs: 12, md: 8, lg: 9 }}>
            <Skeleton variant="rounded" height={500} />
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (!project) return null;

  const currentTranslation = project.translations.find(tr => tr.locale === localeTab) ?? project.translations[0];
  const vis = visibilityMap[project.visibility];

  const STAR_FIELDS: Array<{ key: keyof typeof currentTranslation; label: string; hint: string }> = [
    { key: 'situation', label: 'Situação', hint: 'Nenhum conteúdo' },
    { key: 'task', label: 'Tarefa', hint: 'Nenhum conteúdo' },
    { key: 'action', label: 'Ação', hint: 'Nenhum conteúdo' },
    { key: 'result', label: 'Resultado', hint: 'Nenhum conteúdo' },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, mx: 'auto', width: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          component={NextLink}
          href="/dashboard/projects"
          startIcon={<ArrowBack sx={{ fontSize: '0.9rem' }} />}
          size="small"
          sx={{ color: 'text.disabled', fontSize: '0.8rem', mb: 2, pl: 0 }}>
          Projetos
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
              <Typography variant="overline" sx={{ color: 'primary.main', letterSpacing: '0.12em', fontSize: '0.65rem' }}>
                Projeto
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: vis.color }}>
                {vis.icon}
                <Typography variant="caption" sx={{ fontSize: '0.65rem', color: vis.color }}>
                  {vis.label}
                </Typography>
              </Box>
              {project.published && (
                <Chip
                  label="Publicado"
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 18,
                    fontSize: '0.6rem',
                    borderColor: alpha(theme.palette.success.main, 0.4),
                    color: 'success.main',
                    background: alpha(theme.palette.success.main, 0.06),
                  }}
                />
              )}
              {project.featured && (
                <Chip
                  icon={<Star sx={{ fontSize: '0.65rem !important' }} />}
                  label="Destaque"
                  size="small"
                  variant="outlined"
                  sx={{
                    height: 18,
                    fontSize: '0.6rem',
                    borderColor: alpha(theme.palette.warning.main, 0.4),
                    color: 'warning.main',
                    background: alpha(theme.palette.warning.main, 0.06),
                  }}
                />
              )}
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
              {currentTranslation?.title ?? project.slug}
            </Typography>
            <Typography
              variant="body2"
              color="text.disabled"
              sx={{ mt: 0.5, fontFamily: '"JetBrains Mono", monospace', fontSize: '0.72rem' }}>
              /projects/{project.slug}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, alignItems: 'center' }}>
            <Button
              component={NextLink}
              href={`/dashboard/projects/${id}/edit`}
              variant="contained"
              startIcon={<Edit />}
              size="small"
              sx={{ display: { xs: 'none', sm: 'flex' } }}>
              Editar
            </Button>
            <IconButton size="small" onClick={e => setMenuAnchor(e.currentTarget)} sx={{ color: 'text.disabled' }}>
              <MoreVert fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* ── Left sidebar ── */}
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, position: { md: 'sticky' }, top: { md: 24 } }}>
            {/* Status */}
            <Card elevation={0}>
              <CardContent sx={{ p: 3 }}>
                <SectionHeader icon={<FolderSpecial />} title="Status" />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {[
                    { field: 'published' as const, label: 'Publicado', sub: 'Visível para o público', color: 'success' as const },
                    { field: 'featured' as const, label: 'Destaque', sub: 'Seções especiais', color: 'warning' as const },
                  ].map(({ field, label, sub, color }) => (
                    <Box key={field} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                          {label}
                        </Typography>
                        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
                          {sub}
                        </Typography>
                      </Box>
                      <Switch checked={project[field]} onChange={() => handleToggle(field)} size="small" color={color} />
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Slug
                </Typography>
                {editingSlug ? (
                  <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                    <TextField
                      value={slugValue}
                      onChange={e => setSlugValue(e.target.value)}
                      size="small"
                      fullWidth
                      InputProps={{ sx: { fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem' } }}
                    />
                    <IconButton size="small" onClick={handleSaveSlug} sx={{ color: 'success.main', flexShrink: 0 }}>
                      <Save fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditingSlug(false);
                        setSlugValue(project.slug);
                      }}
                      sx={{ color: 'text.disabled', flexShrink: 0 }}>
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box
                    onClick={() => setEditingSlug(true)}
                    sx={{
                      mt: 1,
                      px: 1.5,
                      py: 0.75,
                      borderRadius: '8px',
                      background: alpha(theme.palette.primary.main, 0.06),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                      '&:hover': { borderColor: alpha(theme.palette.primary.main, 0.35) },
                      transition: 'border-color 0.15s',
                    }}>
                    <Typography
                      variant="caption"
                      sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', color: 'primary.main', wordBreak: 'break-all' }}>
                      {project.slug}
                    </Typography>
                    <Edit sx={{ fontSize: '0.75rem', color: 'text.disabled', flexShrink: 0 }} />
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Author + dates */}
            <Card elevation={0}>
              <CardContent sx={{ p: 3 }}>
                <SectionHeader icon={<Public />} title="Informações" />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                  <Avatar
                    src={project.author.avatarUrl ?? undefined}
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    }}>
                    {project.author.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {project.author.name}
                    </Typography>
                    <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.68rem' }}>
                      Autor
                    </Typography>
                  </Box>
                </Box>
                {[
                  {
                    label: 'Criado em',
                    value: new Date(project.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
                  },
                  {
                    label: 'Atualizado',
                    value: new Date(project.updatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
                  },
                  { label: 'Ordem', value: String(project.order) },
                ].map(({ label, value }) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.72rem' }}>
                      {label}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ fontSize: '0.72rem', fontFamily: '"JetBrains Mono", monospace', color: 'text.secondary' }}>
                      {value}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Techs */}
            {project.techs.length > 0 && (
              <Card elevation={0}>
                <CardContent sx={{ p: 3 }}>
                  <SectionHeader icon={<Memory />} title="Tecnologias" />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {project.techs.map(({ tech }) => (
                      <Chip key={tech.id} label={tech.name} size="small" variant="outlined" />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {project.tags.length > 0 && (
              <Card elevation={0}>
                <CardContent sx={{ p: 3 }}>
                  <SectionHeader icon={<Tag />} title="Tags" />
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                    {project.tags.map(({ tag }) => {
                      const name = tag.translations.find(tr => tr.locale === localeTab)?.name ?? tag.slug;
                      return <Chip key={tag.id} label={name} size="small" variant="outlined" sx={{ color: 'text.secondary' }} />;
                    })}
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Metrics */}
            {project.metrics.length > 0 && (
              <Card elevation={0}>
                <CardContent sx={{ p: 3 }}>
                  <SectionHeader icon={<Star />} title="Métricas" />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {[...project.metrics]
                      .sort((a, b) => a.order - b.order)
                      .map(metric => {
                        const label = metric.translations.find(tr => tr.locale === localeTab)?.label ?? '';
                        return (
                          <Box key={metric.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                              {label}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                fontFamily: '"JetBrains Mono", monospace',
                                fontSize: '0.85rem',
                                color: 'primary.main',
                              }}>
                              {metric.value}
                              {metric.unit ? ` ${metric.unit}` : ''}
                            </Typography>
                          </Box>
                        );
                      })}
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        </Grid>

        {/* ── Right content ── */}
        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Card elevation={0}>
              <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                  <SectionHeader icon={<Language />} title="Conteúdo" />
                  <Button
                    component={NextLink}
                    href={`/dashboard/projects/${id}/edit`}
                    startIcon={<Edit sx={{ fontSize: '0.85rem' }} />}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.75rem', flexShrink: 0 }}>
                    Editar
                  </Button>
                </Box>

                <Tabs
                  value={localeTab}
                  onChange={(_, v) => setLocaleTab(v)}
                  sx={{
                    mb: 3,
                    minHeight: 36,
                    '& .MuiTab-root': { minHeight: 36, fontSize: '0.8rem', fontWeight: 500, textTransform: 'none', py: 0 },
                    '& .MuiTabs-indicator': { height: 2 },
                  }}>
                  <Tab value="PT" label="Português" />
                  <Tab value="EN" label="English" />
                </Tabs>

                {currentTranslation ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.disabled"
                        sx={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Título
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.02em', mt: 0.5 }}>
                        {currentTranslation.title || (
                          <Box component="span" sx={{ color: 'text.disabled', fontStyle: 'italic', fontWeight: 400 }}>
                            Sem título
                          </Box>
                        )}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        color="text.disabled"
                        sx={{ fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Resumo
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0.5,
                          lineHeight: 1.7,
                          color: currentTranslation.summary ? 'text.primary' : 'text.disabled',
                          fontStyle: currentTranslation.summary ? 'normal' : 'italic',
                        }}>
                        {currentTranslation.summary || 'Sem resumo'}
                      </Typography>
                    </Box>

                    <Divider>
                      <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                        MÉTODO STAR
                      </Typography>
                    </Divider>

                    <Grid container spacing={2}>
                      {STAR_FIELDS.map(({ key, label, hint }) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={key}>
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: '10px',
                              border: `1px solid ${theme.palette.divider}`,
                              height: '100%',
                              background: alpha(theme.palette.background.paper, 0.4),
                            }}>
                            <StarField label={label} value={currentTranslation[key] as string} hint={hint} />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ) : (
                  <Box sx={{ py: 6, textAlign: 'center' }}>
                    <Typography color="text.disabled" variant="body2">
                      Tradução {localeTab} não encontrada
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Images */}
            {project.images.length > 0 && (
              <Card elevation={0}>
                <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
                  <SectionHeader icon={<FolderSpecial />} title="Imagens" />
                  <Grid container spacing={1.5}>
                    {[...project.images]
                      .sort((a, b) => a.order - b.order)
                      .map(img => (
                        <Grid size={{ xs: 6, sm: 4 }} key={img.id}>
                          <Box
                            sx={{
                              borderRadius: '10px',
                              overflow: 'hidden',
                              border: `1px solid ${theme.palette.divider}`,
                              aspectRatio: '16/9',
                              background: alpha(theme.palette.background.paper, 0.5),
                            }}>
                            <Box
                              component="img"
                              src={img.url}
                              alt={img.translations.find(tr => tr.locale === localeTab)?.caption ?? ''}
                              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                          </Box>
                          {img.translations.find(tr => tr.locale === localeTab)?.caption && (
                            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.68rem', mt: 0.5, display: 'block' }}>
                              {img.translations.find(tr => tr.locale === localeTab)?.caption}
                            </Typography>
                          )}
                        </Grid>
                      ))}
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Mobile edit */}
      <Box sx={{ display: { xs: 'flex', sm: 'none' }, mt: 3 }}>
        <Button component={NextLink} href={`/dashboard/projects/${id}/edit`} variant="contained" startIcon={<Edit />} fullWidth>
          Editar projeto
        </Button>
      </Box>

      {/* Actions menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
        <MenuItem component={NextLink} href={`/dashboard/projects/${id}/edit`} onClick={() => setMenuAnchor(null)}>
          <Edit sx={{ fontSize: '0.9rem', mr: 1.5 }} /> Editar
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            window.open(`/projects/${project.slug}`, '_blank');
          }}>
          <OpenInNew sx={{ fontSize: '0.9rem', mr: 1.5 }} /> Ver no site
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            setMenuAnchor(null);
            setDeleteDialog(true);
          }}
          sx={{ color: 'error.main' }}>
          <Delete sx={{ fontSize: '0.9rem', mr: 1.5 }} /> Deletar
        </MenuItem>
      </Menu>

      {/* Delete dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>Deletar projeto?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Esta ação não pode ser desfeita. O projeto{' '}
            <Box
              component="span"
              sx={{ fontWeight: 700, color: 'text.primary', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.85rem' }}>
              {project.slug}
            </Box>{' '}
            será removido permanentemente.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setDeleteDialog(false)} variant="outlined" size="small">
            Cancelar
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error" size="small" disabled={deleting}>
            {deleting ? 'Deletando...' : 'Deletar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} sx={{ fontSize: '0.85rem' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
