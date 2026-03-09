'use client';

import { useColorMode } from '@/src/components/ThemeProvider';
import { ArrowForward, DarkMode, Email, GitHub, Language, LightMode, LinkedIn, Search, Star } from '@mui/icons-material';
import { Avatar, Box, Chip, IconButton, TextField, InputAdornment, Tooltip, Typography, alpha, useTheme } from '@mui/material';
import NextLink from 'next/link';
import { useState } from 'react';

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
// Static data
// ─────────────────────────────────────────

const TECHS = [
  'NestJS', 'Next.js', 'PostgreSQL', 'Prisma', 'TypeScript',
  'Docker', 'GitLab CI', 'ExcelJS', 'PDFKit', 'MUI', 'React',
];

const TAGS = [
  { id: 'government',   name: 'Governo' },
  { id: 'social-impact', name: 'Impacto Social' },
  { id: 'automation',   name: 'Automação' },
  { id: 'integration',  name: 'Integração' },
  { id: 'civic-tech',   name: 'Civic Tech' },
  { id: 'reports',      name: 'Relatórios' },
  { id: 'migration',    name: 'Migração' },
];

interface Project {
  slug: string;
  title: string;
  summary: string;
  featured: boolean;
  mainImage: string;
  techs: string[];
  tags: string[];
  metrics: { value: string; label: string }[];
}

const PROJECTS: Project[] = [
  {
    slug: 'mcmv-minha-casa-minha-vida',
    mainImage: '/projects/mcmv-minha-casa-minha-vida/cover.png',
    title: 'MCMV — Minha Casa Minha Vida',
    summary:
      'Sistema completo de habilitação e hierarquização de beneficiários do programa Minha Casa Minha Vida, implantado em 8 municípios, substituindo um processo manual de 12 páginas por um fluxo digital rastreável e conforme decreto.',
    featured: true,
    techs: ['NestJS', 'Next.js', 'PostgreSQL', 'Prisma', 'TypeScript', 'Docker', 'GitLab CI', 'ExcelJS', 'PDFKit', 'MUI'],
    tags: ['government', 'social-impact', 'automation', 'reports'],
    metrics: [
      { value: '8', label: 'Municípios' },
      { value: '0', label: 'Planilhas manuais' },
    ],
  },
  {
    slug: 'top-timon-orcamento-participativo',
    mainImage: '/projects/top-timon-orcamento-participativo/cover.png',
    title: 'TOP — Timon Orçamento Participativo',
    summary:
      'Sistema web completo que digitalizou todo o ciclo do orçamento participativo municipal de Timon — do cadastro de participantes até a apuração e divulgação de resultados — entregue em 20 dias.',
    featured: true,
    techs: ['NestJS', 'Next.js', 'PostgreSQL', 'Prisma', 'TypeScript', 'Docker', 'MUI'],
    tags: ['government', 'civic-tech', 'social-impact', 'automation'],
    metrics: [
      { value: '20 dias', label: 'Entrega' },
      { value: '0', label: 'Intervenção manual' },
    ],
  },
  {
    slug: 'tiajuda-protecao-mulher',
    mainImage: '/projects/tiajuda-protecao-mulher/cover.jpg',
    title: 'TiAjuda — Proteção à Mulher',
    summary:
      'Sistema de proteção e acompanhamento de mulheres em situação de violência, centralizando o atendimento da rede municipal com histórico unificado por caso, encaminhamentos rastreáveis e dados gerenciais para políticas públicas.',
    featured: true,
    techs: ['NestJS', 'Next.js', 'PostgreSQL', 'Prisma', 'TypeScript', 'PDFKit', 'ExcelJS', 'MUI'],
    tags: ['government', 'social-impact', 'reports'],
    metrics: [
      { value: '4', label: 'Órgãos integrados' },
      { value: '100%', label: 'Encaminhamentos rastreáveis' },
    ],
  },
  {
    slug: 'medusa-sistema-medicao-idepi',
    mainImage: '/projects/medusa-sistema-medicao-idepi/cover.jpg',
    title: 'Medusa — Sistema de Medição de Obras (IDEPI)',
    summary:
      'Plataforma completa de gestão de contratos de engenharia para o IDEPI/PI, eliminando a geração manual de 18 documentos por medição e automatizando controle de cronogramas, desvios e reajustes contratuais.',
    featured: true,
    techs: ['NestJS', 'Next.js', 'PostgreSQL', 'Prisma', 'TypeScript', 'ExcelJS', 'PDFKit', 'MUI', 'Docker'],
    tags: ['government', 'automation', 'reports'],
    metrics: [
      { value: '18', label: 'Docs gerados automaticamente' },
      { value: '0', label: 'Geração manual por medição' },
    ],
  },
  {
    slug: 'tiescuta-avaliacao-servicos',
    mainImage: '/projects/tiescuta-avaliacao-servicos/cover.jpg',
    title: 'TiEscuta — Avaliação de Serviços Públicos',
    summary:
      'Sistema de avaliação de serviços públicos municipais com NPS, coleta por QR code e gestão de tickets, substituindo a percepção subjetiva por evidência mensurável sobre a qualidade dos serviços.',
    featured: false,
    techs: ['NestJS', 'Next.js', 'PostgreSQL', 'Prisma', 'TypeScript', 'MUI'],
    tags: ['government', 'civic-tech', 'reports'],
    metrics: [
      { value: 'NPS', label: 'Por secretaria e período' },
    ],
  },
  {
    slug: 'iptu-premiado-timon',
    mainImage: '/projects/iptu-premiado-timon/cover.jpg',
    title: 'IPTU Premiado — Sorteio Municipal',
    summary:
      'Sistema completo do programa IPTU Premiado de Timon, cobrindo importação de contribuintes, validação de elegibilidade, sorteio público com interface animada e gestão de prêmios.',
    featured: false,
    techs: ['NestJS', 'Next.js', 'PostgreSQL', 'Prisma', 'TypeScript', 'ExcelJS'],
    tags: ['government', 'civic-tech', 'automation'],
    metrics: [
      { value: '100%', label: 'Transparência no sorteio' },
    ],
  },
  {
    slug: 'sapl-refactor-camara-timon',
    mainImage: '/projects/sapl-refactor-camara-timon/cover.jpg',
    title: 'SAPL — Modernização do Frontend Legislativo',
    summary:
      'Reconstrução completa do frontend do SAPL da Câmara Municipal de Timon, entregando interface moderna sobre backend original intacto sem alterar nenhuma regra de negócio.',
    featured: false,
    techs: ['Next.js', 'React', 'TypeScript', 'MUI'],
    tags: ['government', 'migration'],
    metrics: [
      { value: '0', label: 'Regras alteradas' },
      { value: '100%', label: 'Compatibilidade com backend' },
    ],
  },
  {
    slug: 'etiquetix-impressao-etiquetas',
    mainImage: '/projects/etiquetix-impressao-etiquetas/cover.jpg',
    title: 'Etiquetix — Impressão de Etiquetas para Restaurantes',
    summary:
      'Sistema de impressão de etiquetas com QR code, múltiplos layouts, preview visual em HTML e comunicação direta com impressora térmica ARGOX via protocolo PPLA — sem depender de software proprietário caro.',
    featured: false,
    techs: ['NestJS', 'React', 'TypeScript', 'PostgreSQL', 'Prisma'],
    tags: ['integration', 'automation'],
    metrics: [
      { value: '0', label: 'Software proprietário' },
      { value: '100%', label: 'Preview antes de imprimir' },
    ],
  },
  {
    slug: 'integracao-nayax-saipos',
    mainImage: '/projects/integracao-nayax-saipos/cover.jpg',
    title: 'Integração Nayax → Saipos',
    summary:
      'Integração entre o sistema de pagamentos Nayax e o sistema de pedidos Saipos com padrão outbox/fila, tratamento de duplicatas e Dead Letter Queue — eliminando o registro manual com garantia de entrega.',
    featured: false,
    techs: ['NestJS', 'PostgreSQL', 'Prisma', 'TypeScript'],
    tags: ['integration', 'automation'],
    metrics: [
      { value: '0', label: 'Registros manuais' },
      { value: '100%', label: 'Garantia de entrega' },
    ],
  },
];

// ─────────────────────────────────────────
// Project card
// ─────────────────────────────────────────

function ProjectCard({ project }: { project: Project }) {
  const theme = useTheme();

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
        background:
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.background.paper, 0.5)
            : theme.palette.background.paper,
        backdropFilter: 'blur(12px)',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        '&:hover': {
          borderColor: alpha(theme.palette.primary.main, 0.45),
          transform: 'translateY(-4px)',
          boxShadow: `0 20px 48px ${alpha(theme.palette.primary.main, 0.1)}`,
          '& .card-image': { transform: 'scale(1.04)' },
          '& .card-arrow': {
            transform: 'translate(3px, -3px)',
            color: theme.palette.primary.main,
          },
        },
      }}>
      {/* Image */}
      <Box
        sx={{
          aspectRatio: '16/9',
          overflow: 'hidden',
          background:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.primary.main, 0.06)
              : alpha(theme.palette.primary.main, 0.04),
          position: 'relative',
          flexShrink: 0,
        }}>
        <Box
          className="card-image"
          component="img"
          src={project.mainImage}
          alt={project.title}
          onError={(e: any) => { e.currentTarget.style.display = 'none'; }}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />

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
            {project.tags.slice(0, 3).map(tagId => {
              const tag = TAGS.find(t => t.id === tagId);
              return (
                <Typography
                  key={tagId}
                  sx={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.6rem',
                    letterSpacing: '0.08em',
                    color: 'primary.main',
                    textTransform: 'uppercase',
                  }}>
                  #{tag?.name ?? tagId}
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
            {project.title}
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
          {project.summary}
        </Typography>

        {/* Metrics */}
        {project.metrics.length > 0 && (
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            {project.metrics.map((m, i) => (
              <Box key={i}>
                <Typography
                  sx={{
                    fontFamily: '"Cabinet Grotesk", "DM Sans", sans-serif',
                    fontWeight: 800,
                    fontSize: '1rem',
                    letterSpacing: '-0.03em',
                    color: 'primary.main',
                    lineHeight: 1.1,
                  }}>
                  {m.value}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.58rem',
                    color: 'text.disabled',
                    letterSpacing: '0.04em',
                    mt: 0.25,
                  }}>
                  {m.label}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {/* Techs */}
        {project.techs.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.625, flexWrap: 'wrap', mt: 'auto' }}>
            {project.techs.slice(0, 5).map(tech => (
              <Box
                key={tech}
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
                  {tech}
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

  const [search, setSearch] = useState('');
  const [activeTech, setActiveTech] = useState<string | null>(null);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = PROJECTS.filter(p => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.summary.toLowerCase().includes(search.toLowerCase());
    const matchTech = !activeTech || p.techs.includes(activeTech);
    const matchTag = !activeTag || p.tags.includes(activeTag);
    return matchSearch && matchTech && matchTag;
  });

  const featured = filtered.filter(p => p.featured);
  const rest = filtered.filter(p => !p.featured);

  const topTechs = TECHS.filter(t => PROJECTS.some(p => p.techs.includes(t)));

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
            <Box component="span" sx={{ color: 'primary.main' }}>.</Box>
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title={CONTACT.github}>
              <IconButton component="a" href={CONTACT.github} target="_blank" rel="noopener noreferrer" size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                <GitHub sx={{ fontSize: '1.05rem' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="LinkedIn">
              <IconButton component="a" href={CONTACT.linkedin} target="_blank" rel="noopener noreferrer" size="small" sx={{ color: 'text.secondary', '&:hover': { color: '#0A66C2' } }}>
                <LinkedIn sx={{ fontSize: '1.05rem' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title={CONTACT.email}>
              <IconButton component="a" href={`mailto:${CONTACT.email}`} size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
                <Email sx={{ fontSize: '1.05rem' }} />
              </IconButton>
            </Tooltip>

            <Box sx={{ width: 1, height: 20, bgcolor: 'divider', mx: 0.5 }} />

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
              <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', color: 'text.disabled', letterSpacing: '0.1em' }}>
                disponível para oportunidades
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
              Olá, eu sou{' '}
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
              Desenvolvedora full-stack especializada em sistemas municipais. NestJS, Next.js, PostgreSQL e muito café.
            </Typography>

            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              <Box
                component="a"
                href={CONTACT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 1,
                  px: 2.25, py: 1.125, borderRadius: '10px',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  color: '#fff', textDecoration: 'none',
                  fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', fontWeight: 600,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.35)}`,
                  transition: 'all 0.2s ease',
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.45)}` },
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
                  display: 'inline-flex', alignItems: 'center', gap: 1,
                  px: 2.25, py: 1.125, borderRadius: '10px',
                  border: `1px solid ${theme.palette.divider}`,
                  background: alpha(theme.palette.background.paper, 0.6),
                  color: 'text.secondary', textDecoration: 'none',
                  fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', fontWeight: 500,
                  backdropFilter: 'blur(8px)', transition: 'all 0.2s ease',
                  '&:hover': { borderColor: alpha(theme.palette.primary.main, 0.4), color: 'text.primary', transform: 'translateY(-2px)' },
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
                  position: 'absolute', inset: -16, borderRadius: '50%',
                  background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
                  filter: 'blur(16px)',
                }}
              />
              <Avatar
                sx={{
                  width: 160, height: 160,
                  border: `3px solid ${alpha(theme.palette.primary.main, 0.25)}`,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.primary.dark, 0.3)})`,
                  fontSize: '3.5rem', fontWeight: 800,
                  fontFamily: '"Cabinet Grotesk", sans-serif',
                  color: 'primary.main', position: 'relative',
                  boxShadow: `0 24px 64px ${alpha(theme.palette.primary.main, 0.2)}`,
                }}>
                E
              </Avatar>
            </Box>
          </Box>
        </Box>

        {/* ── STACK ── */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ height: 1, background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.5)}, ${theme.palette.divider}, transparent)`, mb: 4 }} />
          <Typography variant="overline" sx={{ fontSize: '0.62rem', letterSpacing: '0.15em', color: 'text.disabled', display: 'block', mb: 2 }}>
            STACK
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {topTechs.map(tech => (
              <Box
                key={tech}
                onClick={() => setActiveTech(activeTech === tech ? null : tech)}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 0.875,
                  px: 1.5, py: 0.75, borderRadius: '9px',
                  border: `1px solid ${activeTech === tech ? alpha(theme.palette.primary.main, 0.5) : theme.palette.divider}`,
                  background: activeTech === tech ? alpha(theme.palette.primary.main, 0.08) : alpha(theme.palette.background.paper, 0.5),
                  cursor: 'pointer', transition: 'all 0.15s ease',
                  '&:hover': { borderColor: alpha(theme.palette.primary.main, 0.4), background: alpha(theme.palette.primary.main, 0.05) },
                }}>
                <Typography
                  sx={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '0.72rem',
                    color: activeTech === tech ? 'primary.main' : 'text.secondary',
                    fontWeight: activeTech === tech ? 600 : 400,
                  }}>
                  {tech}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ── PROJECTS ── */}
        <Box sx={{ mb: 12 }}>
          {/* Section header + search */}
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
              <Typography variant="overline" sx={{ fontSize: '0.62rem', letterSpacing: '0.15em', color: 'text.disabled', display: 'block' }}>
                PROJETOS
              </Typography>
              <Typography
                component="h2"
                sx={{
                  fontFamily: '"Cabinet Grotesk", "DM Sans", sans-serif',
                  fontWeight: 800, fontSize: '1.6rem',
                  letterSpacing: '-0.03em', color: 'text.primary',
                }}>
                Casos de estudo
              </Typography>
            </Box>

            <TextField
              size="small"
              placeholder="Buscar projeto..."
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
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 4 }}>
            <Chip
              label="Todos"
              size="small"
              onClick={() => { setActiveTag(null); setActiveTech(null); }}
              variant={!activeTag && !activeTech ? 'filled' : 'outlined'}
              color={!activeTag && !activeTech ? 'primary' : 'default'}
              sx={{ fontSize: '0.72rem' }}
            />
            {TAGS.map(tag => (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                onClick={() => setActiveTag(activeTag === tag.id ? null : tag.id)}
                variant={activeTag === tag.id ? 'filled' : 'outlined'}
                color={activeTag === tag.id ? 'primary' : 'default'}
                sx={{ fontSize: '0.72rem' }}
              />
            ))}
          </Box>

          {filtered.length === 0 ? (
            <Box sx={{ py: 10, textAlign: 'center', border: `1px dashed ${theme.palette.divider}`, borderRadius: '16px' }}>
              <Typography color="text.disabled" variant="body2">Nenhum projeto encontrado.</Typography>
            </Box>
          ) : (
            <>
              {featured.length > 0 && (
                <Box sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: featured.length === 1 ? '1fr' : 'repeat(2, 1fr)' },
                      gap: 2.5,
                    }}>
                    {featured.map(p => <ProjectCard key={p.slug} project={p} />)}
                  </Box>
                </Box>
              )}

              {rest.length > 0 && (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 2.5 }}>
                  {rest.map(p => <ProjectCard key={p.slug} project={p} />)}
                </Box>
              )}
            </>
          )}
        </Box>

        {/* ── CONTACT BANNER ── */}
        <Box
          sx={{
            mb: 8, p: { xs: 3.5, md: 5 }, borderRadius: '20px',
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
                fontWeight: 800, fontSize: { xs: '1.3rem', md: '1.6rem' },
                letterSpacing: '-0.03em', color: 'text.primary', mb: 0.5,
              }}>
              Vamos conversar?
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem' }}>
              Aberta a oportunidades, freelas e colaborações.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', flexShrink: 0 }}>
            <Box
              component="a"
              href={`mailto:${CONTACT.email}`}
              sx={{
                display: 'inline-flex', alignItems: 'center', gap: 0.75,
                px: 2, py: 1, borderRadius: '10px',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                color: '#fff', textDecoration: 'none',
                fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem', fontWeight: 600,
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
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 1,
          }}>
          <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.68rem', color: 'text.disabled', letterSpacing: '0.06em' }}>
            © {new Date().getFullYear()} {FIRST_NAME}
          </Typography>
          <Typography sx={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.65rem', color: 'text.disabled', letterSpacing: '0.04em' }}>
            Next.js · MUI · NestJS
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}