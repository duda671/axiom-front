'use client';

import { useColorMode } from '@/src/components/ThemeProvider';
import { useAuthContext } from '@/src/contexts/AuthContext';
import { useLogout } from '@/src/hooks/auth/useAuth';
import { useTranslation } from '@/src/hooks/useTranslation';
import {
  ChevronLeft,
  ChevronRight,
  CloudUpload,
  DarkMode,
  FolderSpecial,
  GridView,
  LightMode,
  LocalOffer,
  Logout,
  Memory,
  MenuOpen,
  People,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import NextLink from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const SIDEBAR_EXPANDED = 240;
const SIDEBAR_COLLAPSED = 68;

interface NavItem {
  key: string;
  icon: React.ReactNode;
  href: string;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'overview', icon: <GridView />, href: '/dashboard' },
  { key: 'projects', icon: <FolderSpecial />, href: '/dashboard/projects' },
  { key: 'techs', icon: <Memory />, href: '/dashboard/techs' },
  { key: 'tags', icon: <LocalOffer />, href: '/dashboard/tags' },
  { key: 'users', icon: <People />, href: '/dashboard/users', adminOnly: true },
  { key: 'upload', icon: <CloudUpload />, href: '/dashboard/upload' },
];

export function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthContext();
  const { execute: logout } = useLogout();
  const { mode, toggleMode } = useColorMode();
  const { t, locale, setLocale } = useTranslation();

  const sidebarWidth = collapsed && !isMobile ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const isActive = (href: string) => (href === '/dashboard' ? pathname === href : pathname.startsWith(href));

  const navItems = NAV_ITEMS.filter(item => !item.adminOnly || user?.role === 'ADMIN');

  const SidebarContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, #090E1A 0%, #0B1120 100%)'
            : 'linear-gradient(180deg, #F8FAFF 0%, #F0F4FE 100%)',
        borderRight: `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        width: sidebarWidth,
      }}>
      {/* Header */}
      <Box
        sx={{
          px: collapsed ? 1.5 : 2.5,
          pt: 2.5,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          minHeight: 64,
        }}>
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: '8px',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
              }}>
              <Box
                component="span"
                sx={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: '#fff',
                  letterSpacing: '-0.02em',
                }}>
                PF
              </Box>
            </Box>
            <Typography
              variant="overline"
              sx={{
                color: 'text.secondary',
                fontSize: '0.65rem',
                letterSpacing: '0.12em',
              }}>
              PORTFOLIO
            </Typography>
          </Box>
        )}

        {!isMobile && (
          <IconButton onClick={() => setCollapsed(p => !p)} size="small" sx={{ color: 'text.disabled' }}>
            {collapsed ? <ChevronRight fontSize="small" /> : <ChevronLeft fontSize="small" />}
          </IconButton>
        )}
      </Box>

      <Divider />

      {/* Nav */}
      <List sx={{ px: 1, pt: 1.5, flex: 1 }} disablePadding>
        {navItems.map(item => {
          const active = isActive(item.href);
          const label = t(`nav.${item.key}` as any);

          return (
            <Tooltip key={item.href} title={collapsed ? label : ''} placement="right" arrow>
              <ListItemButton
                component={NextLink}
                href={item.href}
                onClick={() => isMobile && setMobileOpen(false)}
                sx={{
                  borderRadius: '10px',
                  mb: 0.5,
                  px: collapsed ? 1.5 : 1.5,
                  py: 1,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  minHeight: 44,
                  background: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                  border: '1px solid',
                  borderColor: active ? alpha(theme.palette.primary.main, 0.2) : 'transparent',
                  color: active ? 'primary.main' : 'text.secondary',
                  '&:hover': {
                    background: active ? alpha(theme.palette.primary.main, 0.12) : alpha(theme.palette.primary.main, 0.05),
                    color: active ? 'primary.main' : 'text.primary',
                  },
                  transition: 'all 0.15s ease',
                }}>
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? 0 : 36,
                    color: 'inherit',
                    '& svg': { fontSize: '1.1rem' },
                  }}>
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: active ? 600 : 400,
                      fontFamily: '"DM Sans", sans-serif',
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      <Divider />

      {/* Footer */}
      <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Locale toggle */}
        <Tooltip title={collapsed ? (locale === 'pt' ? 'English' : 'Português') : ''} placement="right">
          <Box
            onClick={() => setLocale(locale === 'pt' ? 'en' : 'pt')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: collapsed ? 1.5 : 1.5,
              py: 1,
              borderRadius: '10px',
              cursor: 'pointer',
              color: 'text.secondary',
              justifyContent: collapsed ? 'center' : 'flex-start',
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.05),
                color: 'text.primary',
              },
              transition: 'all 0.15s ease',
            }}>
            <Box
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: 'primary.main',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                borderRadius: '4px',
                px: 0.75,
                py: 0.25,
                lineHeight: 1.4,
                flexShrink: 0,
              }}>
              {locale.toUpperCase()}
            </Box>
            {!collapsed && (
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                {locale === 'pt' ? 'Português' : 'English'}
              </Typography>
            )}
          </Box>
        </Tooltip>

        {/* Theme toggle */}
        <Tooltip title={collapsed ? (mode === 'dark' ? 'Light mode' : 'Dark mode') : ''} placement="right">
          <Box
            onClick={toggleMode}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: collapsed ? 1.5 : 1.5,
              py: 1,
              borderRadius: '10px',
              cursor: 'pointer',
              color: 'text.secondary',
              justifyContent: collapsed ? 'center' : 'flex-start',
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.05),
                color: 'text.primary',
              },
              transition: 'all 0.15s ease',
            }}>
            <Box sx={{ display: 'flex', flexShrink: 0 }}>
              {mode === 'dark' ? <LightMode sx={{ fontSize: '1.1rem' }} /> : <DarkMode sx={{ fontSize: '1.1rem' }} />}
            </Box>
            {!collapsed && (
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                {mode === 'dark' ? t('theme.light') : t('theme.dark')}
              </Typography>
            )}
          </Box>
        </Tooltip>

        <Divider sx={{ my: 0.5 }} />

        {/* User */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: collapsed ? 0 : 1,
            py: 0.5,
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}>
          <Avatar
            src={user?.avatarUrl ?? undefined}
            sx={{
              width: 32,
              height: 32,
              fontSize: '0.75rem',
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              flexShrink: 0,
            }}>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>

          {!collapsed && (
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                {user?.name}
              </Typography>
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{
                  fontSize: '0.68rem',
                  fontFamily: '"JetBrains Mono", monospace',
                  letterSpacing: '0.04em',
                }}>
                {user?.role}
              </Typography>
            </Box>
          )}

          {!collapsed && (
            <Tooltip title={t('nav.logout')}>
              <IconButton onClick={handleLogout} size="small" sx={{ color: 'text.disabled', flexShrink: 0 }}>
                <Logout sx={{ fontSize: '1rem' }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {collapsed && (
          <Tooltip title={t('nav.logout')} placement="right">
            <IconButton onClick={handleLogout} size="small" sx={{ color: 'text.disabled', alignSelf: 'center' }}>
              <Logout sx={{ fontSize: '1rem' }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile topbar */}
      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            px: 2,
            zIndex: 1200,
            borderBottom: `1px solid ${theme.palette.divider}`,
            background: theme.palette.background.paper,
          }}>
          <IconButton onClick={() => setMobileOpen(true)} size="small">
            <MenuOpen />
          </IconButton>
          <Typography variant="overline" sx={{ ml: 2, color: 'text.secondary', letterSpacing: '0.12em', fontSize: '0.65rem' }}>
            PORTFOLIO
          </Typography>
        </Box>
      )}

      {/* Mobile drawer */}
      {isMobile ? (
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { width: SIDEBAR_EXPANDED, border: 'none' } }}>
          {SidebarContent}
        </Drawer>
      ) : (
        <Box
          component="nav"
          sx={{
            width: sidebarWidth,
            flexShrink: 0,
            transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'sticky',
            top: 0,
            height: '100vh',
          }}>
          {SidebarContent}
        </Box>
      )}

      {/* Main */}
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          pt: isMobile ? 7 : 0,
          background: theme.palette.background.default,
        }}>
        {children}
      </Box>
    </Box>
  );
}
