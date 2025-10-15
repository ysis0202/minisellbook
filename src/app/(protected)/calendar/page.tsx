'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLogo } from '@/components/app-logo';
import { MonthCard } from '@/components/month-card';
import { useYearSummary } from '@/lib/hooks/use-entries';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CalendarPage() {
  const router = useRouter();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { data: yearData } = useYearSummary(currentYear);

  // 연간 총합 계산
  const yearTotal = yearData ? Object.values(yearData).reduce(
    (acc, month) => ({
      income: acc.income + month.income,
      expense: acc.expense + month.expense,
      savings: acc.savings + (month.savings || 0),
    }),
    { income: 0, expense: 0, savings: 0 }
  ) : { income: 0, expense: 0, savings: 0 };

  const yearBalance = yearTotal.income - yearTotal.expense - yearTotal.savings;

  const handleMonthClick = (month: string) => {
    router.push(`/home?month=${month}`);
  };

  const handlePrevYear = () => {
    setCurrentYear(prev => prev - 1);
  };

  const handleNextYear = () => {
    setCurrentYear(prev => prev + 1);
  };

  const currentYearNow = new Date().getFullYear();
  const isNextYearDisabled = currentYear >= currentYearNow + 1;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
        <div className="px-4 pt-3 pb-2 flex justify-center">
          <AppLogo size="sm" />
        </div>
        <div className="px-4 pb-3">
          <h1 className="text-base font-bold">연간 요약</h1>
        </div>
      </div>

      {/* 연도 전환 */}
      <div className="bg-white border-b px-4 py-2">
        <div className="flex items-center justify-between max-w-xs mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevYear}
            className="h-9 w-9 rounded-full hover:bg-gray-100 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="text-lg font-bold text-gray-800">
            {currentYear}년
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextYear}
            disabled={isNextYearDisabled}
            className="h-9 w-9 rounded-full hover:bg-gray-100 active:scale-95 disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* 연간 요약 카드 */}
      <div className="bg-white border-b px-3 py-2.5">
        <div className="grid grid-cols-4 gap-2">
          {/* 수입 */}
          <div className="bg-emerald-50 rounded-lg p-2.5 text-center">
            <div className="text-[11px] text-emerald-600 font-medium mb-0.5">수입</div>
            <div className="text-sm font-bold text-emerald-700">
              {yearTotal.income.toLocaleString()}
            </div>
          </div>

          {/* 지출 */}
          <div className="bg-red-50 rounded-lg p-2.5 text-center">
            <div className="text-[11px] text-red-600 font-medium mb-0.5">지출</div>
            <div className="text-sm font-bold text-red-700">
              {yearTotal.expense.toLocaleString()}
            </div>
          </div>

          {/* 저축 */}
          <div className="bg-blue-50 rounded-lg p-2.5 text-center">
            <div className="text-[11px] text-blue-600 font-medium mb-0.5">저축</div>
            <div className="text-sm font-bold text-blue-700">
              {yearTotal.savings.toLocaleString()}
            </div>
          </div>

          {/* 순수익 */}
          <div className="bg-purple-50 rounded-lg p-2.5 text-center">
            <div className="text-[11px] text-purple-600 font-medium mb-0.5">순잔액</div>
            <div className={`text-sm font-bold ${
              yearBalance > 0 ? 'text-emerald-700' : yearBalance < 0 ? 'text-red-700' : 'text-gray-700'
            }`}>
              {yearBalance >= 0 ? '+' : ''}{yearBalance.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* 월별 카드 그리드 (3x4) */}
      <div className="p-3">
        <div className="grid grid-cols-3 gap-2.5">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
            <MonthCard
              key={month}
              month={month}
              income={yearData?.[month]?.income || 0}
              expense={yearData?.[month]?.expense || 0}
              savings={yearData?.[month]?.savings || 0}
              onMonthClick={handleMonthClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}