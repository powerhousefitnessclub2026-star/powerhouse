import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value;
  const isAuthenticated = token === 'powerhouse-authenticated-session';
  const { pathname } = request.nextUrl;

  // Paths that require authentication
  const isAdminPath = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isAdminApi = pathname.startsWith('/api/admin') && pathname !== '/api/admin/auth' && pathname !== '/api/admin/check-auth';

  // If user is trying to access protected route without being authenticated
  if ((isAdminPath || isAdminApi) && !isAuthenticated) {
    if (isAdminApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If user is already authenticated and tries to visit the login page, redirect to dashboard
  if (pathname === '/admin/login' && isAuthenticated) {
    const dashboardUrl = new URL('/admin', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
