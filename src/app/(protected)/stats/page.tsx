'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMonthSummary } from '@/lib/hooks/use-entries';
import { MonthSwitcher } from '@/components/month-switcher';
import { TrendingUp, TrendingDown, PieChart, BarChart3 } from 'lucide-react';

export default function StatsPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.toISOString().slice(0, 7));

  const { data: summary, isLoading } = useMonthSummary(currentMonth);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-green-600';
    if (balance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getSavingsRate = () => {
    if (!summary || summary.income === 0) return 0;
    return ((summary.balance / summary.income) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900">통계</h1>
          <p className="text-sm text-gray-500">월별 수입·지출 현황</p>
        </div>
      </div>

      {/* 월 전환 */}
      <MonthSwitcher
        currentMonth={currentMonth}
        onMonthChange={setCurrentMonth}
      />

      {isLoading ? (
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {/* 메인 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <TrendingUp className="w-5 h-5" />
                  총 수입
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatAmount(summary?.income || 0)}원
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <TrendingDown className="w-5 h-5" />
                  총 지출
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatAmount(summary?.expense || 0)}원
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <BarChart3 className="w-5 h-5" />
                  순잔액
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getBalanceColor(summary?.balance || 0)}`}>
                  {summary?.balance && summary.balance >= 0 ? '+' : ''}
                  {formatAmount(summary?.balance || 0)}원
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 상세 분석 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 저축률 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  저축률
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600">
                    {getSavingsRate().toFixed(1)}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(0, Math.min(100, getSavingsRate()))}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">
                    수입 대비 저축 비율
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 일평균 */}
            <Card>
              <CardHeader>
                <CardTitle>일평균 통계</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">일평균 수입</span>
                  <span className="font-medium text-green-600">
                    {formatAmount(Math.round((summary?.income || 0) / 30))}원
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">일평균 지출</span>
                  <span className="font-medium text-red-600">
                    {formatAmount(Math.round((summary?.expense || 0) / 30))}원
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">일평균 순잔액</span>
                  <span className={`font-medium ${getBalanceColor(summary?.balance || 0)}`}>
                    {formatAmount(Math.round((summary?.balance || 0) / 30))}원
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 비교 분석 */}
          <Card>
            <CardHeader>
              <CardTitle>월별 비교</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>월별 비교 차트는 추후 업데이트 예정입니다</p>
                <p className="text-sm mt-1">더 자세한 분석을 위해 준비 중입니다</p>
              </div>
            </CardContent>
          </Card>

          {/* 요약 카드 */}
          {summary && (summary.income > 0 || summary.expense > 0) && (
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-700">이번 달 요약</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {summary.balance > 0 ? (
                    <p className="text-green-700">
                      🎉 이번 달은 <strong>{formatAmount(summary.balance)}원</strong>을 절약했습니다!
                    </p>
                  ) : summary.balance < 0 ? (
                    <p className="text-red-700">
                      ⚠️ 이번 달은 <strong>{formatAmount(Math.abs(summary.balance))}원</strong> 적자입니다.
                    </p>
                  ) : (
                    <p className="text-gray-700">
                      💰 이번 달은 수입과 지출이 균형을 이루고 있습니다.
                    </p>
                  )}

                  {getSavingsRate() > 20 && (
                    <p className="text-blue-700">
                      💪 저축률이 {getSavingsRate().toFixed(1)}%로 우수합니다!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}