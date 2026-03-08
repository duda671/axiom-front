import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];
const AUTH_ROUTES = ['/login', '/register'];
const DASHBOARD_PREFIX = '/dashboard';
const ADMIN_PREFIX = '/dashboard/admin';

const isPublic = (pathname: string) => PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));

const isAuthRoute = (pathname: string) => AUTH_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));

const isDashboard = (pathname: string) => pathname === DASHBOARD_PREFIX || pathname.startsWith(DASHBOARD_PREFIX + '/');

const isAdminRoute = (pathname: string) => pathname === ADMIN_PREFIX || pathname.startsWith(ADMIN_PREFIX + '/');

const decodeJwtPayload = (token: string): Record<string, any> | null => {
  try {
    const base64 = token.split('.')[1];
    if (!base64) return null;
    const json = Buffer.from(base64, 'base64url').toString('utf-8');
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const isTokenExpired = (payload: Record<string, any>): boolean => {
  if (!payload.exp) return true;
  return Date.now() >= payload.exp * 1000;
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('access_token')?.value;
  const payload = accessToken ? decodeJwtPayload(accessToken) : null;
  const isAuthenticated = !!payload && !isTokenExpired(payload);
  const role: string = payload?.role ?? '';

  if (isAuthRoute(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (isDashboard(pathname) && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute(pathname) && isAuthenticated && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard?error=forbidden', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Roda em todas as rotas exceto:
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - arquivos com extensão (png, jpg, svg, etc.)
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};
