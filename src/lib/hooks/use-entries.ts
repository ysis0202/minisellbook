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
        } else if (entry.kind === 'expense') {
          acc.expense += Number(entry.amount);
        } else if (entry.kind === 'savings') {
          acc.savings += Number(entry.amount);
        }
        return acc;
      },
      { income: 0, expense: 0, savings: 0 }
    );

    return {
      ...summary,
      balance: summary.income - summary.expense - summary.savings,
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

export function useMonthEntries(month: string) {
  const supabase = createClient();

  return useSWR(['month-entries', month], async () => {
    const startDate = `${month}-01`;
    const endDate = new Date(new Date(startDate).getFullYear(), new Date(startDate).getMonth() + 1, 0)
      .toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('entries')
      .select('entry_date, kind')
      .gte('entry_date', startDate)
      .lte('entry_date', endDate)
      .is('deleted_at', null);

    if (error) throw error;

    // 날짜별로 수입/지출/저축 존재 여부를 맵으로 저장
    const dateMap: Record<string, { hasIncome: boolean; hasExpense: boolean; hasSavings: boolean }> = {};

    data.forEach((entry: any) => {
      if (!dateMap[entry.entry_date]) {
        dateMap[entry.entry_date] = { hasIncome: false, hasExpense: false, hasSavings: false };
      }
      if (entry.kind === 'income') {
        dateMap[entry.entry_date].hasIncome = true;
      } else if (entry.kind === 'expense') {
        dateMap[entry.entry_date].hasExpense = true;
      } else if (entry.kind === 'savings') {
        dateMap[entry.entry_date].hasSavings = true;
      }
    });

    return dateMap;
  });
}

export function useCategoryStats(month: string) {
  const supabase = createClient();

  return useSWR(['category-stats', month], async () => {
    const startDate = `${month}-01`;
    const endDate = new Date(new Date(startDate).getFullYear(), new Date(startDate).getMonth() + 1, 0)
      .toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('entries')
      .select(`
        amount,
        kind,
        categories(id, name, emoji, kind)
      `)
      .gte('entry_date', startDate)
      .lte('entry_date', endDate)
      .is('deleted_at', null);

    if (error) throw error;

    // Group by category
    const categoryMap = new Map();
    data.forEach((entry: any) => {
      const category = entry.categories;
      if (!category) return;

      const key = category.id;
      if (!categoryMap.has(key)) {
        categoryMap.set(key, {
          id: category.id,
          name: category.name,
          emoji: category.emoji,
          kind: category.kind,
          total: 0,
          count: 0,
        });
      }

      const cat = categoryMap.get(key);
      cat.total += Number(entry.amount);
      cat.count += 1;
    });

    const categories = Array.from(categoryMap.values());
    const incomeCategories = categories.filter(c => c.kind === 'income').sort((a, b) => b.total - a.total);
    const expenseCategories = categories.filter(c => c.kind === 'expense').sort((a, b) => b.total - a.total);
    const savingsCategories = categories.filter(c => c.kind === 'savings').sort((a, b) => b.total - a.total);

    return {
      income: incomeCategories,
      expense: expenseCategories,
      savings: savingsCategories,
    };
  });
}

export function useYearSummary(year: number) {
  const supabase = createClient();

  return useSWR(['year-summary', year], async () => {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const { data, error } = await supabase
      .from('entries')
      .select('entry_date, kind, amount')
      .gte('entry_date', startDate)
      .lte('entry_date', endDate)
      .is('deleted_at', null);

    if (error) throw error;

    // 월별로 그룹화
    const monthlyData: Record<number, { income: number; expense: number; savings: number }> = {};

    for (let i = 1; i <= 12; i++) {
      monthlyData[i] = { income: 0, expense: 0, savings: 0 };
    }

    data.forEach((entry: any) => {
      const month = parseInt(entry.entry_date.split('-')[1], 10);
      const amount = Number(entry.amount);

      if (entry.kind === 'income') {
        monthlyData[month].income += amount;
      } else if (entry.kind === 'expense') {
        monthlyData[month].expense += amount;
      } else if (entry.kind === 'savings') {
        monthlyData[month].savings += amount;
      }
    });

    return monthlyData;
  });
}

export function useYearStats(year: number) {
  const supabase = createClient();

  return useSWR(['year-stats', year], async () => {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

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
        } else if (entry.kind === 'expense') {
          acc.expense += Number(entry.amount);
        } else if (entry.kind === 'savings') {
          acc.savings += Number(entry.amount);
        }
        return acc;
      },
      { income: 0, expense: 0, savings: 0 }
    );

    return {
      ...summary,
      balance: summary.income - summary.expense - summary.savings,
    };
  });
}

export function useSavingsGoal(month: string) {
  const supabase = createClient();

  return useSWR(['savings-goal', month], async () => {
    const monthDate = `${month}-01`;

    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('month', monthDate)
      .maybeSingle();

    if (error) throw error;
    return data;
  });
}