'use client';

import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface MonthCardProps {
  month: number;
  income: number;
  expense: number;
  savings?: number;
  onMonthClick: (month: string) => void;
}

const MONTH_NAMES = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월'
];

export function MonthCard({ month, income, expense, savings = 0, onMonthClick }: MonthCardProps) {
  const balance = income - expense - savings;
  const hasData = income > 0 || expense > 0 || savings > 0;

  const handleClick = () => {
    const year = new Date().getFullYear();
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    onMonthClick(monthStr);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'bg-white rounded-lg p-3 shadow-sm border transition-all duration-200 active:scale-95 min-h-[120px] flex flex-col',
        hasData ? 'border-gray-200 hover:shadow-md' : 'border-gray-100 opacity-60'
      )}
    >
      {/* 월 */}
      <div className="text-base font-bold text-gray-700 mb-2">
        {MONTH_NAMES[month - 1]}
      </div>

      {hasData ? (
        <div className="space-y-1.5 flex-1">
          {/* 수입 */}
          {income > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[10px] text-gray-500">수입</span>
              </div>
              <span className="text-xs font-semibold text-emerald-600">
                +{income.toLocaleString()}
              </span>
            </div>
          )}

          {/* 지출 */}
          {expense > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                <span className="text-[10px] text-gray-500">지출</span>
              </div>
              <span className="text-xs font-semibold text-red-600">
                -{expense.toLocaleString()}
              </span>
            </div>
          )}

          {/* 저축 */}
          {savings > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-[10px] text-gray-500">저축</span>
              </div>
              <span className="text-xs font-semibold text-blue-600">
                -{savings.toLocaleString()}
              </span>
            </div>
          )}

          {/* 잔액 */}
          <div className="pt-1.5 mt-1.5 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-gray-500">잔액</span>
              <span className={cn(
                'text-sm font-bold',
                balance > 0 ? 'text-emerald-600' : balance < 0 ? 'text-red-600' : 'text-gray-500'
              )}>
                {balance >= 0 ? '+' : ''}{balance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <span className="text-[10px] text-gray-400">데이터 없음</span>
        </div>
      )}
    </button>
  );
}
