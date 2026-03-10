// ─────────────────────────────────────────
// Code Highlights
// ─────────────────────────────────────────

import { Check, ContentCopy } from '@mui/icons-material';
import { alpha, Box, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import { useState } from 'react';
import { Locale } from '../data/projects-data';

export type CodeHighlight = {
  titlePt: string;
  titleEn: string;
  descriptionPt?: string;
  descriptionEn?: string;
  filePath?: string;
  language: string;
  code: string;
};

export function CodeBlock({
  titlePt,
  titleEn,
  descriptionPt,
  descriptionEn,
  filePath,
  language,
  code,
  locale,
}: CodeHighlight & { locale: Locale }) {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '14px',
        overflow: 'hidden',
        background: theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.5) : theme.palette.background.paper,
        mb: 3,
      }}>
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          background: theme.palette.mode === 'dark' ? alpha('#000', 0.25) : alpha(theme.palette.background.default, 0.6),
        }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
          {/* Traffic lights decorativos */}
          <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
            {['#ff5f57', '#ffbd2e', '#28ca42'].map(c => (
              <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.8 }} />
            ))}
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: '"Cabinet Grotesk", "DM Sans", sans-serif',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'text.primary',
                lineHeight: 1.2,
              }}>
              {locale === 'PT' ? titlePt : titleEn}
            </Typography>
            {filePath && (
              <Typography
                sx={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.62rem',
                  color: 'text.disabled',
                  mt: 0.25,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                {filePath}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          {/* Language badge */}
          <Box
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: '5px',
              background: alpha(theme.palette.primary.main, 0.1),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}>
            <Typography
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.58rem',
                fontWeight: 600,
                color: 'primary.light',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}>
              {language}
            </Typography>
          </Box>

          {/* Copy button */}
          <Tooltip title={copied ? (locale === 'PT' ? 'Copiado!' : 'Copied!') : locale === 'PT' ? 'Copiar' : 'Copy'}>
            <IconButton
              size="small"
              onClick={handleCopy}
              sx={{
                color: copied ? 'success.main' : 'text.disabled',
                transition: 'color 0.15s',
                '&:hover': { color: 'text.secondary' },
              }}>
              {copied ? <Check sx={{ fontSize: '0.9rem' }} /> : <ContentCopy sx={{ fontSize: '0.9rem' }} />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Description */}
      {(descriptionPt || descriptionEn) && (
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            borderBottom: `1px solid ${theme.palette.divider}`,
            background: alpha(theme.palette.primary.main, 0.03),
          }}>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '0.82rem',
              color: 'text.secondary',
              lineHeight: 1.65,
            }}>
            {locale === 'PT' ? descriptionPt : descriptionEn}
          </Typography>
        </Box>
      )}

      {/* Code */}
      <Box
        component="pre"
        sx={{
          m: 0,
          p: 2.5,
          overflow: 'auto',
          background: 'transparent',
          '& code': {
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.8rem',
            lineHeight: 1.7,
            color: theme.palette.mode === 'dark' ? '#a8d8ff' : '#1e4070',
            whiteSpace: 'pre',
          },
        }}>
        <code>{code}</code>
      </Box>
    </Box>
  );
}
