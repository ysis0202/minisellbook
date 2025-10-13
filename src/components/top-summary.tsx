'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useMonthSummary } from '@/lib/hooks/use-entries';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface TopSummaryProps {
  month: string;
}

export function TopSummary({ month }: TopSummaryProps) {
  const { data: summary, isLoading } = useMonthSummary(month);

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-3 p-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
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
    },
    {
      title: '지출',
      amount: summary?.expense || 0,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: '잔액',
      amount: summary?.balance || 0,
      icon: DollarSign,
      color: (summary?.balance || 0) >= 0 ? 'text-blue-600' : 'text-red-600',
      bgColor: (summary?.balance || 0) >= 0 ? 'bg-blue-50' : 'bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 p-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <Card key={card.title} className={`${card.bgColor} border-0`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <IconComponent className={`w-4 h-4 ${card.color}`} />
                <span className="text-sm font-medium text-gray-600">
                  {card.title}
                </span>
              </div>
              <div className={`text-lg font-bold ${card.color}`}>
                {formatAmount(card.amount)}원
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}