'use client';

import useSWR from 'swr';
import { createClient } from '@/lib/supabase/client';
import { EntryWithDetails } from '@/lib/types';

export function useEntriesByDate(dateISO: string) {
  const supabase = createClient();

  return useSWR(['entries', dateISO], async () => {
    const { data, error } = await supabase
      .from('entries')
      .select(`
        *,
        categories(name, kind, emoji),
        accounts(name)
      `)
      .eq('entry_date', dateISO)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as EntryWithDetails[];
  });
}

export function useMonthSummary(month: string) {
  const supabase = createClient();

  return useSWR(['month-summary', month], async () => {
    const startDate = `${month}-01`;
    const endDate = new Date(new Date(startDate).getFullYear(), new Date(startDate).getMonth() + 1, 0)
      .toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('entries')
      .select('kind, amount')
      .gte('entry_date', startDate)
      .lte('entry_date', endDate)
      .is('deleted_at', null);

    if (error) throw error;

    const summary = data.reduce(
      (acc, entry) => {
        if (entry.kind === 'income') {
          acc.income += Number(entry.amount);
        } else {
          acc.expense += Number(entry.amount);
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );

    return {
      ...summary,
      balance: summary.income - summary.expense,
    };
  });
}

export function useAccounts() {
  const supabase = createClient();

  return useSWR(['accounts'], async () => {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('archived', false)
      .order('is_default', { ascending: false });

    if (error) throw error;
    return data;
  });
}

export function useCategories() {
  const supabase = createClient();

  return useSWR(['categories'], async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('archived', false)
      .order('sort');

    if (error) throw error;
    return data;
  });
}