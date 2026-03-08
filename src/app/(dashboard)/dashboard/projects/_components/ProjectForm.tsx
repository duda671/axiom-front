'use client';

import { type CreateProjectDto, type ProjectTranslation } from '@/src/hooks/project/useProject';
import { CheckCircle, FolderSpecial, Language, LinkOff, Lock } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
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
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

export type Visibility = 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
export type LocaleTab = 'PT' | 'EN';

export const EMPTY_TRANSLATION = (locale: LocaleTab): ProjectTranslation => ({
  locale,
  title: '',
  summary: '',
  situation: '',
  task: '',
  action: '',
  result: '',
});

export interface ProjectFormProps {
  mode: 'create' | 'edit';
  initialValues?: {
    slug: string;
    visibility: Visibility;
    published: boolean;
    featured: boolean;
    translations: ProjectTranslation[];
  };
  loading: boolean;
  onSubmit: (payload: CreateProjectDto) => Promise<void>;
  submitRef?: React.RefObject<(() => void) | null>;
  snackbar?: { open: boolean; message: string; severity: 'success' | 'error' };
  onCloseSnackbar?: () => void;
}

// ─────────────────────────────────────────
// SectionHeader
// ─────────────────────────────────────────

export function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 3 }}>
      <Box sx={{ mt: 0.25, color: 'primary.main', display: 'flex', '& svg': { fontSize: '1.1rem' } }}>{icon}</Box>
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.72rem' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────
// TranslationFields
// ─────────────────────────────────────────

function TranslationFields({
  value,
  onChange,
  errors,
}: {
  value: ProjectTranslation;
  onChange: (field: keyof ProjectTranslation, v: string) => void;
  errors: Partial<Record<keyof ProjectTranslation, string>>;
}) {
  const STAR_FIELDS: Array<{ key: keyof ProjectTranslation; label: string; hint: string }> = [
    { key: 'situation', label: 'Situação', hint: 'Contexto e problema que motivou o projeto' },
    { key: 'task', label: 'Tarefa', hint: 'O que era esperado que você fizesse' },
    { key: 'action', label: 'Ação', hint: 'O que você fez concretamente' },
    { key: 'result', label: 'Resultado', hint: 'Impacto mensurável ou qualitativo' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <TextField
        label="Título"
        value={value.title}
        onChange={e => onChange('title', e.target.value)}
        error={!!errors.title}
        helperText={errors.title}
        fullWidth
        size="small"
      />
      <TextField
        label="Resumo"
        value={value.summary}
        onChange={e => onChange('summary', e.target.value)}
        error={!!errors.summary}
        helperText={errors.summary}
        multiline
        minRows={2}
        fullWidth
        size="small"
      />

      <Divider sx={{ my: 0.5 }}>
        <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.68rem', letterSpacing: '0.1em' }}>
          MÉTODO STAR
        </Typography>
      </Divider>

      <Grid container spacing={2}>
        {STAR_FIELDS.map(({ key, label, hint }) => (
          <Grid size={{ xs: 12, sm: 6 }} key={key}>
            <TextField
              label={label}
              value={value[key] as string}
              onChange={e => onChange(key, e.target.value)}
              error={!!errors[key]}
              helperText={errors[key] ?? hint}
              multiline
              minRows={3}
              fullWidth
              size="small"
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// ─────────────────────────────────────────
// ProjectForm
// ─────────────────────────────────────────

export function ProjectForm({ mode, initialValues, loading, onSubmit, submitRef, snackbar, onCloseSnackbar }: ProjectFormProps) {
  const theme = useTheme();
  const isEdit = mode === 'edit';

  // Inicializa uma única vez com initialValues
  const [slug, setSlug] = useState(initialValues?.slug ?? '');
  const [visibility, setVisibility] = useState<Visibility>(initialValues?.visibility ?? 'PUBLIC');
  const [published, setPublished] = useState(initialValues?.published ?? false);
  const [featured, setFeatured] = useState(initialValues?.featured ?? false);
  const [localeTab, setLocaleTab] = useState<LocaleTab>('PT');
  const [translations, setTranslations] = useState<Record<LocaleTab, ProjectTranslation>>({
    PT: initialValues?.translations.find(t => t.locale === 'PT') ?? EMPTY_TRANSLATION('PT'),
    EN: initialValues?.translations.find(t => t.locale === 'EN') ?? EMPTY_TRANSLATION('EN'),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const syncedRef = useRef(false);
  useEffect(() => {
    if (!initialValues || syncedRef.current) return;
    syncedRef.current = true;
    setSlug(initialValues.slug);
    setVisibility(initialValues.visibility);
    setPublished(initialValues.published);
    setFeatured(initialValues.featured);
    setTranslations({
      PT: initialValues.translations.find(t => t.locale === 'PT') ?? EMPTY_TRANSLATION('PT'),
      EN: initialValues.translations.find(t => t.locale === 'EN') ?? EMPTY_TRANSLATION('EN'),
    });
  }, [initialValues]);

  const updateTranslation = (locale: LocaleTab, field: keyof ProjectTranslation, value: string) => {
    setTranslations(prev => ({ ...prev, [locale]: { ...prev[locale], [field]: value } }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[`${locale}.${field}`];
      return next;
    });
  };

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

  const validate = (currentSlug: string, currentTranslations: Record<LocaleTab, ProjectTranslation>) => {
    const newErrors: Record<string, string> = {};

    if (!currentSlug) newErrors.slug = 'Slug é obrigatório';
    else if (currentSlug.length < 3) newErrors.slug = 'Mínimo de 3 caracteres';
    else if (!/^[a-z0-9-]+$/.test(currentSlug)) newErrors.slug = 'Apenas letras minúsculas, números e hífens';

    (['PT', 'EN'] as LocaleTab[]).forEach(locale => {
      const tr = currentTranslations[locale];
      if (!tr.title) newErrors[`${locale}.title`] = 'Obrigatório';
      else if (tr.title.length < 3) newErrors[`${locale}.title`] = 'Mínimo de 3 caracteres';

      if (!tr.summary) newErrors[`${locale}.summary`] = 'Obrigatório';
      else if (tr.summary.length < 10) newErrors[`${locale}.summary`] = 'Mínimo de 10 caracteres';

      (['situation', 'task', 'action', 'result'] as Array<keyof ProjectTranslation>).forEach(field => {
        const val = tr[field] as string;
        if (!val) newErrors[`${locale}.${field}`] = 'Obrigatório';
        else if (val.length < 10) newErrors[`${locale}.${field}`] = 'Mínimo de 10 caracteres';
      });
    });

    return newErrors;
  };

  // useCallback garante referência estável para o onRegisterSubmit
  const handleSubmit = useCallback(async () => {
    const newErrors = validate(slug, translations);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const fieldLabels: Record<string, string> = {
        title: 'Título',
        summary: 'Resumo',
        situation: 'Situação',
        task: 'Tarefa',
        action: 'Ação',
        result: 'Resultado',
      };
      Object.entries(newErrors).forEach(([field, message]) => {
        if (field === 'slug') {
          toast.error(`Slug: ${message}`);
        } else {
          const [loc, key] = field.split('.');
          toast.error(`${fieldLabels[key] ?? key} (${loc}): ${message}`);
        }
      });
      return;
    }
    
    const cleanTranslations = Object.values(translations).map(({ locale, title, summary, situation, task, action, result }) => ({
      locale,
      title,
      summary,
      situation,
      task,
      action,
      result,
    }));
    await onSubmit({ slug, visibility, published, featured, translations: cleanTranslations });
  }, [slug, visibility, published, featured, translations, onSubmit]);

  if (submitRef) {
    submitRef.current = handleSubmit;
  }

  const visibilityOptions: Array<{ value: Visibility; label: string; icon: React.ReactNode; color: string }> = [
    { value: 'PUBLIC', label: 'Público', icon: <Language sx={{ fontSize: '0.9rem' }} />, color: theme.palette.success.main },
    { value: 'PRIVATE', label: 'Privado', icon: <Lock sx={{ fontSize: '0.9rem' }} />, color: theme.palette.error.main },
    { value: 'UNLISTED', label: 'Não listado', icon: <LinkOff sx={{ fontSize: '0.9rem' }} />, color: theme.palette.warning.main },
  ];
  const selectedVisibility = visibilityOptions.find(v => v.value === visibility)!;

  const translationErrors = (locale: LocaleTab) =>
    Object.fromEntries(
      Object.entries(errors)
        .filter(([k]) => k.startsWith(`${locale}.`))
        .map(([k, v]) => [k.replace(`${locale}.`, ''), v]),
    ) as Partial<Record<keyof ProjectTranslation, string>>;

  const hasMissingLocale = (locale: LocaleTab) => {
    const tr = translations[locale];
    return (
      !tr.title ||
      tr.title.length < 3 ||
      !tr.summary ||
      tr.summary.length < 10 ||
      !tr.situation ||
      tr.situation.length < 10 ||
      !tr.task ||
      tr.task.length < 10 ||
      !tr.action ||
      tr.action.length < 10 ||
      !tr.result ||
      tr.result.length < 10
    );
  };

  return (
    <>
      <Grid container spacing={3}>
        {/* ── Left ── */}
        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, position: { md: 'sticky' }, top: { md: 24 } }}>
            <Card elevation={0}>
              <CardContent sx={{ p: 3 }}>
                <SectionHeader icon={<FolderSpecial />} title="Identidade" subtitle="Slug único do projeto" />
                <TextField
                  label="Slug"
                  value={slug}
                  onChange={e => {
                    setSlug(slugify(e.target.value));
                    setErrors(prev => {
                      const n = { ...prev };
                      delete n.slug;
                      return n;
                    });
                  }}
                  error={!!errors.slug}
                  helperText={errors.slug ?? 'Ex: sistema-pagamentos-municipais'}
                  fullWidth
                  size="small"
                  InputProps={{ sx: { fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8rem' } }}
                />
                {slug && (
                  <Box
                    sx={{
                      mt: 1.5,
                      px: 1.5,
                      py: 0.75,
                      borderRadius: '8px',
                      background: alpha(theme.palette.primary.main, 0.06),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                    }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'primary.main',
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '0.68rem',
                        wordBreak: 'break-all',
                      }}>
                      /projects/{slug}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>

            <Card elevation={0}>
              <CardContent sx={{ p: 3 }}>
                <SectionHeader icon={<Language />} title="Visibilidade" />
                <FormControl fullWidth size="small">
                  <InputLabel>Visibilidade</InputLabel>
                  <Select
                    value={visibility}
                    label="Visibilidade"
                    onChange={e => setVisibility(e.target.value as Visibility)}
                    renderValue={val => {
                      const opt = visibilityOptions.find(v => v.value === val)!;
                      return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: opt.color }}>
                          {opt.icon}
                          <Typography variant="body2" sx={{ fontSize: '0.85rem', color: opt.color }}>
                            {opt.label}
                          </Typography>
                        </Box>
                      );
                    }}>
                    {visibilityOptions.map(opt => (
                      <MenuItem key={opt.value} value={opt.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ color: opt.color, display: 'flex' }}>{opt.icon}</Box>
                          <Typography variant="body2">{opt.label}</Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Divider sx={{ my: 2.5 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {[
                    { val: published, setter: setPublished, label: 'Publicado', sub: 'Visível para o público', color: 'success' as const },
                    {
                      val: featured,
                      setter: setFeatured,
                      label: 'Destaque',
                      sub: 'Aparece em seções especiais',
                      color: 'warning' as const,
                    },
                  ].map(({ val, setter, label, sub, color }) => (
                    <FormControlLabel
                      key={label}
                      control={<Switch checked={val} onChange={e => setter(e.target.checked)} size="small" color={color} />}
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 500 }}>
                            {label}
                          </Typography>
                          <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
                            {sub}
                          </Typography>
                        </Box>
                      }
                      sx={{ alignItems: 'flex-start', ml: 0, gap: 1 }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{ background: alpha(theme.palette.background.paper, 0.4), border: `1px solid ${theme.palette.divider}` }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.68rem', letterSpacing: '0.1em' }}>
                  RESUMO
                </Typography>
                <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {(['PT', 'EN'] as LocaleTab[]).map(loc => (
                    <Box key={loc} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        Tradução {loc}
                      </Typography>
                      {hasMissingLocale(loc) ? (
                        <Chip
                          label="Incompleto"
                          size="small"
                          variant="outlined"
                          sx={{
                            fontSize: '0.6rem',
                            height: 20,
                            borderColor: alpha(theme.palette.warning.main, 0.4),
                            color: 'warning.main',
                          }}
                        />
                      ) : (
                        <CheckCircle sx={{ fontSize: '0.9rem', color: 'success.main' }} />
                      )}
                    </Box>
                  ))}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      Visibilidade
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: selectedVisibility.color }}>
                      {selectedVisibility.icon}
                      <Typography variant="caption" sx={{ fontSize: '0.72rem', color: selectedVisibility.color }}>
                        {selectedVisibility.label}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        {/* ── Right ── */}
        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          <Card elevation={0}>
            <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
              <SectionHeader icon={<Language />} title="Conteúdo" subtitle="Preencha o conteúdo em ambos os idiomas (PT e EN)" />

              <Tabs
                value={localeTab}
                onChange={(_, v) => setLocaleTab(v)}
                sx={{
                  mb: 3,
                  minHeight: 36,
                  '& .MuiTab-root': { minHeight: 36, fontSize: '0.8rem', fontWeight: 500, textTransform: 'none', py: 0 },
                  '& .MuiTabs-indicator': { height: 2 },
                }}>
                {(['PT', 'EN'] as LocaleTab[]).map(loc => (
                  <Tab
                    key={loc}
                    value={loc}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {loc === 'PT' ? 'Português' : 'English'}
                        {hasMissingLocale(loc) && (
                          <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: theme.palette.warning.main }} />
                        )}
                      </Box>
                    }
                  />
                ))}
              </Tabs>

              <TranslationFields
                value={translations[localeTab]}
                onChange={(field, value) => updateTranslation(localeTab, field, value)}
                errors={translationErrors(localeTab)}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Mobile submit */}
      <Box sx={{ display: { xs: 'flex', sm: 'none' }, gap: 1.5, mt: 3 }}>
        <Button component={NextLink} href="/dashboard/projects" variant="outlined" fullWidth>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading} fullWidth>
          {loading ? (isEdit ? 'Salvando...' : 'Criando...') : isEdit ? 'Salvar' : 'Criar'}
        </Button>
      </Box>

      {snackbar && onCloseSnackbar && (
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={onCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert severity={snackbar.severity} onClose={onCloseSnackbar} sx={{ fontSize: '0.85rem' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}
