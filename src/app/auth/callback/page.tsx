import { createServer } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { code?: string; error?: string };
}) {
  const supabase = createServer();

  if (searchParams.error) {
    console.error('Auth error:', searchParams.error);
    redirect('/auth?error=' + encodeURIComponent(searchParams.error));
  }

  if (searchParams.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(searchParams.code);

    if (error) {
      console.error('Exchange error:', error);
      redirect('/auth?error=' + encodeURIComponent(error.message));
    }
  }

  // 인증 성공 후 온보딩 체크
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (profile) {
      redirect('/home');
    } else {
      redirect('/onboard');
    }
  }

  redirect('/auth');
}