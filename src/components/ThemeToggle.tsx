'use client';

import { useColorMode } from '@/src/components/ThemeProvider';
import { DarkMode, LightMode } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

export function ThemeToggle() {
  const { mode, toggleMode } = useColorMode();

  return (
    <Tooltip title={mode === 'dark' ? 'Modo claro' : 'Modo escuro'} placement="left">
      <IconButton onClick={toggleMode} size="small" sx={{ color: 'text.secondary' }}>
        {mode === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
      </IconButton>
    </Tooltip>
  );
}
