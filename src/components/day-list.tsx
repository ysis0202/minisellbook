'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useEntriesByDate } from '@/lib/hooks/use-entries';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { TrendingUp, TrendingDown, Wallet, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DayListProps {
  selectedDate: string;
  onEditEntry?: (entryId: string) => void;
}

export function DayList({ selectedDate, onEditEntry }: DayListProps) {
  const { data: entries, isLoading } = useEntriesByDate(selectedDate);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const getDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return '오늘';
    } else if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
      return '어제';
    } else {
      return format(date, 'M월 d일 (E)', { locale: ko });
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded"></div>
                </div>
                <div className="h-5 w-20 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalIncome = entries?.filter(e => e.kind === 'income').reduce((sum, e) => sum + Number(e.amount), 0) || 0;
  const totalExpense = entries?.filter(e => e.kind === 'expense').reduce((sum, e) => sum + Number(e.amount), 0) || 0;
  const totalSavings = entries?.filter(e => e.kind === 'savings').reduce((sum, e) => sum + Number(e.amount), 0) || 0;

  return (
    <div className="space-y-3">
      {/* 날짜 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-900">
          {getDateDisplay(selectedDate)}
        </h2>
        <div className="text-xs text-gray-500 font-medium">
          {entries?.length || 0}개 항목
        </div>
      </div>

      {/* 일일 요약 */}
      {(totalIncome > 0 || totalExpense > 0 || totalSavings > 0) && (
        <div className="flex gap-4 text-sm mb-3">
          {totalIncome > 0 && (
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>+{formatAmount(totalIncome)}원</span>
            </div>
          )}
          {totalExpense > 0 && (
            <div className="flex items-center gap-1.5 text-red-600 font-semibold">
              <TrendingDown className="w-4 h-4" />
              <span>-{formatAmount(totalExpense)}원</span>
            </div>
          )}
          {totalSavings > 0 && (
            <div className="flex items-center gap-1.5 text-blue-600 font-semibold">
              <Wallet className="w-4 h-4" />
              <span>-{formatAmount(totalSavings)}원</span>
            </div>
          )}
        </div>
      )}

      {/* 항목 리스트 */}
      <div className="space-y-2">
        {!entries || entries.length === 0 ? (
          <Card className="border-dashed border-gray-300">
            <CardContent className="p-12 text-center">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-gray-500 text-sm font-medium">
                이 날에는 기록된 항목이 없습니다
              </p>
            </CardContent>
          </Card>
        ) : (
          entries.map((entry) => (
            <Card
              key={entry.id}
              className="transition-all duration-200 hover:shadow-lg cursor-pointer active:scale-[0.98] border-gray-200"
              onClick={() => onEditEntry?.(entry.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-2xl leading-none">
                        {entry.categories?.emoji || (entry.kind === 'income' ? '💰' : entry.kind === 'savings' ? '💎' : '💸')}
                      </span>
                      <span className="font-semibold text-gray-900 text-base">
                        {entry.categories?.name || '기타'}
                      </span>
                    </div>
                    {entry.memo && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                        {entry.memo}
                      </p>
                    )}
                    {entry.accounts?.name && (
                      <p className="text-xs text-gray-500 font-medium">
                        {entry.accounts.name}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={cn(
                      'text-lg font-bold whitespace-nowrap',
                      entry.kind === 'income' ? 'text-emerald-600' : entry.kind === 'savings' ? 'text-blue-600' : 'text-red-600'
                    )}>
                      {entry.kind === 'income' ? '+' : '-'}{formatAmount(Number(entry.amount))}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">원</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}