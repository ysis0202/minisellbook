import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED = ['/home', '/calendar', '/stats', '/search', '/profile', '/onboard'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const url = req.nextUrl;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 세션 새로고침 (중요!)
  const { data: { user } } = await supabase.auth.getUser();

  const isProtected = PROTECTED.some((p) => url.pathname.startsWith(p));

  if (isProtected && !user) {
    const loginUrl = new URL('/auth', req.url);
    loginUrl.searchParams.set('redirect', url.pathname + url.search);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)']
};