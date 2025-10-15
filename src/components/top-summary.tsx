'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useMonthSummary } from '@/lib/hooks/use-entries';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface TopSummaryProps {
  month: string;
}

export function TopSummary({ month }: TopSummaryProps) {
  const { data: summary, isLoading } = useMonthSummary(month);

  if (isLoading) {
    return (
      <div className="p-3 space-y-2">
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-2.5">
                <div className="h-3 bg-gray-200 rounded mb-1.5"></div>
                <div className="h-5 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-white/50 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const cards = [
    {
      title: '수입',
      amount: summary?.income || 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      sign: '+',
    },
    {
      title: '지출',
      amount: summary?.expense || 0,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      sign: '-',
    },
    {
      title: '저축',
      amount: summary?.savings || 0,
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      sign: '-',
    },
  ];

  const balance = summary?.balance || 0;

  return (
    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
      <div className="p-3 space-y-2">
        {/* 수입/지출/저축 3칸 */}
        <div className="grid grid-cols-3 gap-2">
          {cards.map((card) => {
            const IconComponent = card.icon;
            return (
              <div key={card.title} className="bg-white/95 backdrop-blur-sm rounded-lg p-2.5 shadow-sm">
                <div className="flex items-center gap-1 mb-1.5">
                  <IconComponent className={`w-3.5 h-3.5 ${card.color}`} />
                  <span className="text-[11px] font-semibold text-gray-700">
                    {card.title}
                  </span>
                </div>
                <div className={`text-sm font-bold ${card.color} leading-tight`}>
                  {card.sign}{formatAmount(card.amount)}
                </div>
                <div className="text-[9px] text-gray-500 mt-0.5">원</div>
              </div>
            );
          })}
        </div>

        {/* 순잔액 */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">순잔액</span>
            <div className="flex items-center gap-1">
              <span className={`text-base font-bold ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {balance >= 0 ? '+' : ''}{formatAmount(balance)}
              </span>
              <span className="text-[10px] text-gray-500">원</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}