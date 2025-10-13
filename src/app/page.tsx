import { createServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const supabase = createServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // 프로필 체크
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
  } else {
    redirect('/auth');
  }

  return null;
}