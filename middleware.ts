import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { hostname, pathname } = request.nextUrl;

  // ─── WWW Canonicalization ────────────────────────────────────────────────
  // Permanently redirect www → non-www so search engines see one canonical URL
  if (hostname.startsWith('www.')) {
    const canonicalUrl = new URL(request.url);
    canonicalUrl.hostname = hostname.slice(4); // strip "www."
    return NextResponse.redirect(canonicalUrl, { status: 308 });
  }

  const token = request.cookies.get('admin-token')?.value;
  const isAuthenticated = token === 'powerhouse-authenticated-session';

  const isAdminPath = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');

  // Protect all admin pages and API endpoints
  if (isAdminPath || isAdminApi) {
    if (!isAuthenticated) {
      const isAuthApi = pathname === '/api/admin/auth' || pathname === '/api/admin/check-auth';
      const isLoginPage = pathname === '/admin/login';

      if (isLoginPage || isAuthApi) {
        const response = NextResponse.next();
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        return response;
      }

      // API requests return 401 Unauthorized
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Unauthenticated page requests to /admin redirect directly to /admin/login
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If user is already authenticated and tries to visit the login page, redirect to dashboard
  if (pathname === '/admin/login' && isAuthenticated) {
    const dashboardUrl = new URL('/admin', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Set cache control for authorized admin routes
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sitemap.xml (SEO sitemap)
     * - robots.txt (SEO robots)
     * - assets (inside public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets|assets/assets).*)',
  ],
};
