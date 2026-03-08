import { ThemeProvider } from '@/src/components/ThemeProvider';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { TranslationProvider } from '@/src/hooks/useTranslation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Portfolio', template: '%s · Portfolio' },
  description: 'Engineering case studies and technical projects.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <TranslationProvider>
            <AuthProvider>{children}</AuthProvider>
          </TranslationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
