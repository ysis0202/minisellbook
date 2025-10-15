'use server';

import { createServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { EntrySchema, type EntryFormData } from '@/lib/schemas';
import { revalidatePath } from 'next/cache';

export async function signInWithGoogle() {
  const supabase = await createServer();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      scopes: 'email profile', // 이메일 및 프로필 정보 권한 요청
      queryParams: {
        access_type: 'offline', // 오프라인 액세스 (선택사항)
        prompt: 'consent', // 항상 동의 화면 표시 (선택사항)
      },
    },
  });

  if (error) {
    console.error('Error:', error);
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signInWithKakao() {
  const supabase = await createServer();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  });

  if (error) {
    console.error('Error:', error);
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signOut() {
  const supabase = await createServer();
  await supabase.auth.signOut();
  redirect('/auth');
}

export async function ensureOnboard() {
  const supabase = await createServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: 'Not authenticated' };
  }

  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (existing) {
    return { ok: true, exists: true };
  }

  const { error } = await supabase.rpc('fn_onboard_seed', {
    p_user_id: user.id,
    p_display_name: user.user_metadata?.name ?? '사용자'
  });

  if (error) {
    console.error('Onboard error:', error);
    return { ok: false, error: error.message };
  }

  return { ok: true, exists: false };
}

export async function createEntry(data: EntryFormData) {
  const supabase = await createServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const validatedData = EntrySchema.parse(data);

    const { error } = await supabase
      .from('entries')
      .insert({
        ...validatedData,
        user_id: user.id,
      });

    if (error) {
      console.error('Create entry error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/home');
    return { success: true };
  } catch (error) {
    console.error('Validation error:', error);
    return { success: false, error: 'Invalid data' };
  }
}

export async function updateEntry(entryId: string, data: EntryFormData) {
  const supabase = await createServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const validatedData = EntrySchema.parse(data);

    const { error } = await supabase
      .from('entries')
      .update(validatedData)
      .eq('id', entryId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Update entry error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/home');
    return { success: true };
  } catch (error) {
    console.error('Validation error:', error);
    return { success: false, error: 'Invalid data' };
  }
}

export async function deleteEntry(entryId: string) {
  const supabase = await createServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('entries')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', entryId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Delete entry error:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/home');
  return { success: true };
}