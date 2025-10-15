'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MonthSwitcherProps {
  currentMonth: string;
  onMonthChange: (month: string) => void;
}

export function MonthSwitcher({ currentMonth, onMonthChange }: MonthSwitcherProps) {
  const formatMonth = (month: string) => {
    const date = new Date(month + '-01');
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
    }).format(date);
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const date = new Date(currentMonth + '-01');
    if (direction === 'prev') {
      date.setMonth(date.getMonth() - 1);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    const newMonth = date.toISOString().slice(0, 7);
    onMonthChange(newMonth);
  };

  const goToToday = () => {
    const today = new Date().toISOString().slice(0, 7);
    onMonthChange(today);
  };

  return (
    <div className="flex items-center justify-between">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => changeMonth('prev')}
        className="h-9 w-9 rounded-full hover:bg-gray-100 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <button
        onClick={goToToday}
        className="text-base font-bold text-gray-900 hover:text-emerald-600 transition-colors active:scale-95"
      >
        {formatMonth(currentMonth)}
      </button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => changeMonth('next')}
        className="h-9 w-9 rounded-full hover:bg-gray-100 active:scale-95"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );
}