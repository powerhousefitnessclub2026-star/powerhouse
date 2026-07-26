import { NextResponse, userAgent } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin-token')?.value;
  const isAuthenticated = token === 'powerhouse-authenticated-session';
  const isAllowedAccess = request.cookies.get('admin-allowed-session')?.value === 'true';
  const { pathname } = request.nextUrl;

  const isAdminPath = pathname.startsWith('/admin');
  const isAdminApi = pathname.startsWith('/api/admin');

  // Handle non-admin paths: Clear admin sessions immediately when navigating away
  if (!isAdminPath && !isAdminApi) {
    const hasAdminToken = request.cookies.has('admin-token');
    const hasAllowedSession = request.cookies.has('admin-allowed-session');

    if (hasAdminToken || hasAllowedSession) {
      const response = NextResponse.next();
      if (hasAdminToken) {
        response.cookies.set('admin-token', '', { maxAge: 0, path: '/' });
      }
      if (hasAllowedSession) {
        response.cookies.set('admin-allowed-session', '', { maxAge: 0, path: '/' });
      }
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      return response;
    }
    return NextResponse.next();
  }

  // Paths that require Chrome & proper authorization
  if (isAdminPath || isAdminApi) {
    // 1. Enforce Google Chrome browser restriction
    const ua = request.headers.get('user-agent') || '';
    const { browser } = userAgent(request);
    const isChrome = 
      (browser.name && browser.name.toLowerCase().includes('chrome')) || 
      (/Chrome|CriOS/.test(ua) && !/Edge|Edg|OPR|Chromium|Vivaldi|YaBrowser/.test(ua));

    if (!isChrome) {
      if (isAdminApi) {
        return NextResponse.json(
          { error: 'Unauthorized browser. Access restricted to Google Chrome.' }, 
          { status: 403 }
        );
      }
      // Redirect to home page if not using Chrome
      return NextResponse.redirect(new URL('/', request.url));
    }

    // 2. Access verification
    if (!isAuthenticated) {
      const isAuthApi = pathname === '/api/admin/auth' || pathname === '/api/admin/check-auth';
      const isLoginPage = pathname === '/admin/login';

      if (isLoginPage) {
        // Only allow viewing the login page if they clicked the logo 5 times (have the cookie)
        if (!isAllowedAccess) {
          return NextResponse.redirect(new URL('/', request.url));
        }
        const response = NextResponse.next();
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');
        return response;
      }

      if (isAuthApi) {
        return NextResponse.next();
      }

      // Any other admin API/page is protected
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // If they have the allowed session cookie (clicked 5 times), direct to login page. Otherwise, send to home.
      if (isAllowedAccess) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      return NextResponse.redirect(new URL('/', request.url));
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
     * Match all request paths except for the ones starting with:
     * - api (unless it starts with api/admin)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (inside public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|assets|assets/assets).*)',
  ],
};
