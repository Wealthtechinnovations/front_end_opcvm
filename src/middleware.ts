import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface PanelConfig {
  loginPath: string;
  allowedTypes: number[];
}

const panelConfig: Record<string, PanelConfig> = {
  '/panel/admin': {
    loginPath: '/panel/admin/login',
    allowedTypes: [0],
  },
  '/panel/portfolio': {
    loginPath: '/panel/portfolio/login',
    allowedTypes: [1, 3, 4],
  },
  '/panel/management': {
    loginPath: '/panel/management/login',
    allowedTypes: [2],
  },
  '/country-panel': {
    loginPath: '/country-panel/login',
    allowedTypes: [5],
  },
};

function decodeJwtPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  for (const [prefix, config] of Object.entries(panelConfig)) {
    if (pathname.startsWith(prefix) && !pathname.startsWith(config.loginPath)) {
      const token = request.cookies.get('tokenEnCours')?.value;
      const isLoggedIn = request.cookies.get('isLoggedIn')?.value;

      if (!token && !isLoggedIn) {
        return NextResponse.redirect(new URL(config.loginPath, request.url));
      }

      if (token) {
        const payload = decodeJwtPayload(token);
        if (payload && payload.typeusers_id != null) {
          const userType = Number(payload.typeusers_id);
          if (!config.allowedTypes.includes(userType)) {
            return NextResponse.redirect(new URL(config.loginPath, request.url));
          }
        }
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/panel/:path*', '/country-panel/:path*'],
};
