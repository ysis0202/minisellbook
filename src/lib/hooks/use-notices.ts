import useSWR from 'swr';
import { createClient } from '@/lib/supabase/client';

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'notice' | 'event' | 'update';
  emoji: string;
  link?: string;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

export function useNotices() {
  const supabase = createClient();

  return useSWR<Notice[]>('notices', async () => {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .eq('is_active', true)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Notices fetch error:', error);
      throw error;
    }

    return data || [];
  });
}

