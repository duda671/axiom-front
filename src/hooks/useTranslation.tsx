'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// ─────────────────────────────────────────
// Translations
// ─────────────────────────────────────────

const translations = {
  pt: {
    nav: {
      overview: 'Visão Geral',
      projects: 'Projetos',
      techs: 'Tecnologias',
      tags: 'Tags',
      users: 'Usuários',
      upload: 'Upload',
      logout: 'Sair',
    },
    theme: {
      light: 'Modo claro',
      dark: 'Modo escuro',
    },
    dashboard: {
      greeting: 'Olá',
      overview: 'Visão Geral',
      overviewSub: 'Acompanhe seus projetos e métricas.',
      stats: {
        totalProjects: 'Total de Projetos',
        published: 'Publicados',
        featured: 'Destaques',
        techs: 'Tecnologias',
      },
      recentProjects: 'Projetos Recentes',
      noProjects: 'Nenhum projeto ainda.',
      createFirst: 'Criar primeiro projeto',
      viewAll: 'Ver todos',
      draft: 'Rascunho',
      published: 'Publicado',
      featured: 'Destaque',
      private: 'Privado',
      unlisted: 'Não listado',
      public: 'Público',
    },
    auth: {
      login: 'Entrar',
      register: 'Criar conta',
      logout: 'Sair',
      email: 'E-mail',
      password: 'Senha',
      name: 'Nome completo',
      forgotPassword: 'Esqueceu a senha?',
      noAccount: 'Não tem uma conta?',
      hasAccount: 'Já tem uma conta?',
      sending: 'Enviando...',
      loggingIn: 'Entrando...',
      creating: 'Criando conta...',
      resetPassword: 'Redefinir senha',
      forgotTitle: 'Recuperar senha',
      forgotSub: 'Informe seu e-mail e enviaremos as instruções.',
      emailSent: 'E-mail enviado',
      emailSentSub: 'Verifique sua caixa de entrada e siga as instruções.',
      backToLogin: 'Voltar ao login',
      sendInstructions: 'Enviar instruções',
      passwordWeak: 'Fraca',
      passwordFair: 'Regular',
      passwordGood: 'Boa',
      passwordStrong: 'Forte',
      passwordLabel: 'Senha',
    },
    common: {
      or: 'ou',
      save: 'Salvar',
      cancel: 'Cancelar',
      delete: 'Excluir',
      edit: 'Editar',
      create: 'Criar',
      search: 'Buscar',
      filter: 'Filtrar',
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
      confirm: 'Confirmar',
    },
  },

  en: {
    nav: {
      overview: 'Overview',
      projects: 'Projects',
      techs: 'Technologies',
      tags: 'Tags',
      users: 'Users',
      upload: 'Upload',
      logout: 'Logout',
    },
    theme: {
      light: 'Light mode',
      dark: 'Dark mode',
    },
    dashboard: {
      greeting: 'Hello',
      overview: 'Overview',
      overviewSub: 'Track your projects and metrics.',
      stats: {
        totalProjects: 'Total Projects',
        published: 'Published',
        featured: 'Featured',
        techs: 'Technologies',
      },
      recentProjects: 'Recent Projects',
      noProjects: 'No projects yet.',
      createFirst: 'Create first project',
      viewAll: 'View all',
      draft: 'Draft',
      published: 'Published',
      featured: 'Featured',
      private: 'Private',
      unlisted: 'Unlisted',
      public: 'Public',
    },
    auth: {
      login: 'Sign in',
      register: 'Create account',
      logout: 'Sign out',
      email: 'Email',
      password: 'Password',
      name: 'Full name',
      forgotPassword: 'Forgot password?',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      sending: 'Sending...',
      loggingIn: 'Signing in...',
      creating: 'Creating account...',
      resetPassword: 'Reset password',
      forgotTitle: 'Recover password',
      forgotSub: "Enter your email and we'll send you instructions.",
      emailSent: 'Email sent',
      emailSentSub: 'Check your inbox and follow the instructions.',
      backToLogin: 'Back to login',
      sendInstructions: 'Send instructions',
      passwordWeak: 'Weak',
      passwordFair: 'Fair',
      passwordGood: 'Good',
      passwordStrong: 'Strong',
      passwordLabel: 'Password',
    },
    common: {
      or: 'or',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      search: 'Search',
      filter: 'Filter',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
    },
  },
} as const;

type Locale = 'pt' | 'en';
type TranslationKeys = typeof translations.pt;

// flat dot-notation getter — ex: t('nav.overview')
type DotNotation<T, Prefix extends string = ''> = {
  [K in keyof T]: T[K] extends object ? DotNotation<T[K], `${Prefix}${string & K}.`> : `${Prefix}${string & K}`;
}[keyof T];

type TranslationPath = DotNotation<TranslationKeys>;

const getNestedValue = (obj: any, path: string): string => {
  return path.split('.').reduce((acc, key) => acc?.[key], obj) ?? path;
};

// ─────────────────────────────────────────
// Context
// ─────────────────────────────────────────

const LOCALE_KEY = '@portfolio:locale';

interface TranslationContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: TranslationPath) => string;
}

const TranslationContext = createContext<TranslationContextValue>({
  locale: 'pt',
  setLocale: () => {},
  t: path => path,
});

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('pt');

  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_KEY) as Locale | null;
    if (stored === 'pt' || stored === 'en') setLocaleState(stored);
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(LOCALE_KEY, next);
  };

  const t = (path: TranslationPath): string => getNestedValue(translations[locale], path as string);

  return <TranslationContext.Provider value={{ locale, setLocale, t }}>{children}</TranslationContext.Provider>;
}

export function useTranslation() {
  return useContext(TranslationContext);
}
