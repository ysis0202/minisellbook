import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/home', '/calendar', '/stats', '/search', '/profile'];

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const isProtected = PROTECTED.some((p) => url.pathname.startsWith(p));
  const hasSession = req.cookies.get('sb-access-token');

  if (isProtected && !hasSession) {
    const loginUrl = new URL('/auth', req.url);
    loginUrl.searchParams.set('redirect', url.pathname + url.search);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)']
};