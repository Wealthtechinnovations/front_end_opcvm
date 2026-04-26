import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const loginPaths: Record<string, string> = {
  '/panel/admin': '/panel/admin/login',
  '/panel/portefeuille': '/panel/portefeuille/login',
  '/panel/societegestionpanel': '/panel/societegestionpanel/login',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  for (const [prefix, loginPath] of Object.entries(loginPaths)) {
    if (pathname.startsWith(prefix) && !pathname.startsWith(loginPath)) {
      const hasToken = request.cookies.get('tokenEnCours')?.value;
      const isLoggedIn = request.cookies.get('isLoggedIn')?.value;
      if (!hasToken && !isLoggedIn) {
        const loginUrl = new URL(loginPath, request.url);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/panel/:path*'],
};
