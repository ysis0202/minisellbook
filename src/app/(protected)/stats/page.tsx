'use client';

import { useState } from 'react';
import { AppLogo } from '@/components/app-logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useMonthSummary, useCategoryStats, useYearStats, useSavingsGoal } from '@/lib/hooks/use-entries';
import { MonthSwitcher } from '@/components/month-switcher';
import { TrendingUp, TrendingDown, PieChart, Target, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { mutate } from 'swr';

export default function StatsPage() {
  const today = new Date();
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
  const [currentMonth, setCurrentMonth] = useState(today.toISOString().slice(0, 7));
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const { data: monthSummary, isLoading: isLoadingMonth } = useMonthSummary(currentMonth);
  const { data: yearSummary, isLoading: isLoadingYear } = useYearStats(currentYear);
  const { data: categoryStats, isLoading: isLoadingCategories } = useCategoryStats(currentMonth);
  const { data: savingsGoal } = useSavingsGoal(currentMonth);

  const [editingGoal, setEditingGoal] = useState(false);
  const [goalAmount, setGoalAmount] = useState('');

  const summary = viewMode === 'month' ? monthSummary : yearSummary;
  const isLoading = viewMode === 'month' ? isLoadingMonth : isLoadingYear;

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-green-600';
    if (balance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const handleSaveGoal = async () => {
    const supabase = createClient();
    const amount = Number(goalAmount);

    if (isNaN(amount) || amount < 0) {
      toast.error('올바른 금액을 입력하세요');
      return;
    }

    const monthDate = `${currentMonth}-01`;

    try {
      const { error } = await supabase
        .from('savings_goals')
        .upsert({
          month: monthDate,
          goal_amount: amount,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        });

      if (error) throw error;

      toast.success('저축 목표가 설정되었습니다');
      mutate(['savings-goal', currentMonth]);
      setEditingGoal(false);
    } catch (error) {
      console.error('Save goal error:', error);
      toast.error('저축 목표 설정에 실패했습니다');
    }
  };

  const handleYearChange = (direction: 'prev' | 'next') => {
    setCurrentYear(prev => direction === 'prev' ? prev - 1 : prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
        <div className="px-4 pt-3 pb-2 flex justify-center">
          <AppLogo size="sm" />
        </div>
        <div className="px-4 pb-3">
          <h1 className="text-base font-bold">통계</h1>
        </div>
      </div>

      {/* 뷰 모드 토글 */}
      <div className="bg-white border-b px-3 py-2">
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            onClick={() => setViewMode('month')}
            className="flex-1 h-9 text-sm"
          >
            월별
          </Button>
          <Button
            variant={viewMode === 'year' ? 'default' : 'outline'}
            onClick={() => setViewMode('year')}
            className="flex-1 h-9 text-sm"
          >
            년도별
          </Button>
        </div>
      </div>

      {/* 날짜 전환 */}
      <div className="bg-white border-b px-4 py-2">
        {viewMode === 'month' ? (
          <MonthSwitcher
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
          />
        ) : (
          <div className="flex items-center justify-between max-w-xs mx-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleYearChange('prev')}
              className="h-9 w-9 rounded-full hover:bg-gray-100 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="text-base font-bold text-gray-800">
              {currentYear}년
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleYearChange('next')}
              className="h-9 w-9 rounded-full hover:bg-gray-100 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="p-3 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-3">
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-3 space-y-3">
          {/* 메인 통계 카드 */}
          <div className="grid grid-cols-3 gap-2">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-1.5 pt-3 px-3">
                <CardTitle className="flex items-center gap-1 text-green-700 text-xs">
                  <TrendingUp className="w-3.5 h-3.5" />
                  총 수입
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="text-base font-bold text-green-600">
                  {formatAmount(summary?.income || 0)}
                </div>
                <div className="text-[9px] text-gray-500">원</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardHeader className="pb-1.5 pt-3 px-3">
                <CardTitle className="flex items-center gap-1 text-red-700 text-xs">
                  <TrendingDown className="w-3.5 h-3.5" />
                  총 지출
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="text-base font-bold text-red-600">
                  {formatAmount(summary?.expense || 0)}
                </div>
                <div className="text-[9px] text-gray-500">원</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-1.5 pt-3 px-3">
                <CardTitle className="flex items-center gap-1 text-blue-700 text-xs">
                  <BarChart3 className="w-3.5 h-3.5" />
                  총 저축
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="text-base font-bold text-blue-600">
                  {formatAmount(summary?.savings || 0)}
                </div>
                <div className="text-[9px] text-gray-500">원</div>
              </CardContent>
            </Card>
          </div>

          {/* 순잔액 카드 */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-1.5 pt-3 px-3">
              <CardTitle className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-purple-700">
                  <BarChart3 className="w-4 h-4" />
                  순잔액
                </div>
                <div className={`text-base font-bold ${getBalanceColor(summary?.balance || 0)}`}>
                  {summary?.balance && summary.balance >= 0 ? '+' : ''}
                  {formatAmount(summary?.balance || 0)}원
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              <div className="text-[10px] text-gray-600">
                수입 - 지출 - 저축 = 순잔액
              </div>
            </CardContent>
          </Card>

          {/* 상세 분석 */}
          <div className="grid grid-cols-2 gap-2">
            {/* 저축 목표 (월별만) */}
            {viewMode === 'month' && (
              <Card>
                <CardHeader className="pb-2 pt-3 px-3">
                  <CardTitle className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5">
                      <Target className="w-4 h-4" />
                      저축 목표
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditingGoal(!editingGoal);
                        setGoalAmount(savingsGoal?.goal_amount?.toString() || '');
                      }}
                      className="h-6 px-2 text-xs"
                    >
                      {editingGoal ? '취소' : '설정'}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3">
                  {editingGoal ? (
                    <div className="space-y-2">
                      <input
                        type="number"
                        value={goalAmount}
                        onChange={(e) => setGoalAmount(e.target.value)}
                        placeholder="목표 금액"
                        className="w-full px-2 py-1.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <Button
                        onClick={handleSaveGoal}
                        size="sm"
                        className="w-full h-7 text-xs"
                      >
                        저장
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {savingsGoal ? (
                        <>
                          <div className="text-xs text-gray-600">목표</div>
                          <div className="text-lg font-bold text-emerald-600">
                            {formatAmount(Number(savingsGoal.goal_amount))}
                          </div>
                          <div className="text-xs text-gray-600 mt-2">실제 저축</div>
                          <div className="text-base font-semibold text-blue-600">
                            {formatAmount(summary?.savings || 0)}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.max(0, Math.min(100, ((summary?.savings || 0) / Number(savingsGoal.goal_amount)) * 100))}%`
                              }}
                            ></div>
                          </div>
                          <p className="text-[10px] text-gray-500 text-center mt-1">
                            {((summary?.savings || 0) / Number(savingsGoal.goal_amount) * 100).toFixed(1)}% 달성
                          </p>
                        </>
                      ) : (
                        <div className="text-center py-3">
                          <Target className="w-8 h-8 mx-auto mb-1.5 text-gray-400" />
                          <p className="text-[10px] text-gray-500">
                            저축 목표를 설정하세요
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 일평균 (월별만) */}
            {viewMode === 'month' && (
              <Card>
                <CardHeader className="pb-2 pt-3 px-3">
                  <CardTitle className="text-sm">일평균 통계</CardTitle>
                </CardHeader>
                <CardContent className="px-3 pb-3 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">수입</span>
                    <span className="font-semibold text-green-600">
                      {formatAmount(Math.round((summary?.income || 0) / 30))}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">지출</span>
                    <span className="font-semibold text-red-600">
                      {formatAmount(Math.round((summary?.expense || 0) / 30))}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-1.5 text-xs">
                    <span className="text-gray-600">순잔액</span>
                    <span className={`font-semibold ${getBalanceColor(summary?.balance || 0)}`}>
                      {formatAmount(Math.round((summary?.balance || 0) / 30))}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 카테고리별 분석 (월별만) */}
          {viewMode === 'month' && (
            <Card>
            <CardHeader className="pb-2 pt-3 px-3">
              <CardTitle className="flex items-center gap-1.5 text-sm">
                <PieChart className="w-4 h-4" />
                카테고리별 분석
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              {isLoadingCategories ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <Tabs defaultValue="expense" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="expense" className="gap-1.5 text-xs">
                      <TrendingDown className="w-3.5 h-3.5" />
                      지출
                    </TabsTrigger>
                    <TabsTrigger value="income" className="gap-1.5 text-xs">
                      <TrendingUp className="w-3.5 h-3.5" />
                      수입
                    </TabsTrigger>
                    <TabsTrigger value="savings" className="gap-1.5 text-xs">
                      <BarChart3 className="w-3.5 h-3.5" />
                      저축
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="expense" className="space-y-2 mt-3">
                    {categoryStats?.expense && categoryStats.expense.length > 0 ? (
                      <>
                        {categoryStats.expense.map((cat, index) => {
                          const percentage = summary?.expense
                            ? (cat.total / summary.expense * 100)
                            : 0;
                          return (
                            <div key={cat.id} className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-lg">{cat.emoji}</span>
                                  <div>
                                    <div className="font-medium text-gray-900 text-sm">{cat.name}</div>
                                    <div className="text-[10px] text-gray-500">{cat.count}건</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold text-red-600 text-sm">
                                    {formatAmount(cat.total)}
                                  </div>
                                  <div className="text-[10px] text-gray-500">
                                    {percentage.toFixed(1)}%
                                  </div>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-gradient-to-r from-red-400 to-red-600 h-1.5 rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <TrendingDown className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">지출 내역이 없습니다</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="income" className="space-y-2 mt-3">
                    {categoryStats?.income && categoryStats.income.length > 0 ? (
                      <>
                        {categoryStats.income.map((cat, index) => {
                          const percentage = summary?.income
                            ? (cat.total / summary.income * 100)
                            : 0;
                          return (
                            <div key={cat.id} className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-lg">{cat.emoji}</span>
                                  <div>
                                    <div className="font-medium text-gray-900 text-sm">{cat.name}</div>
                                    <div className="text-[10px] text-gray-500">{cat.count}건</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold text-green-600 text-sm">
                                    {formatAmount(cat.total)}
                                  </div>
                                  <div className="text-[10px] text-gray-500">
                                    {percentage.toFixed(1)}%
                                  </div>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-gradient-to-r from-green-400 to-green-600 h-1.5 rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <TrendingUp className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">수입 내역이 없습니다</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="savings" className="space-y-2 mt-3">
                    {categoryStats?.savings && categoryStats.savings.length > 0 ? (
                      <>
                        {categoryStats.savings.map((cat, index) => {
                          const percentage = summary?.savings
                            ? (cat.total / summary.savings * 100)
                            : 0;
                          return (
                            <div key={cat.id} className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-lg">{cat.emoji}</span>
                                  <div>
                                    <div className="font-medium text-gray-900 text-sm">{cat.name}</div>
                                    <div className="text-[10px] text-gray-500">{cat.count}건</div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-semibold text-blue-600 text-sm">
                                    {formatAmount(cat.total)}
                                  </div>
                                  <div className="text-[10px] text-gray-500">
                                    {percentage.toFixed(1)}%
                                  </div>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-1.5 rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">저축 내역이 없습니다</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
          )}

          {/* 요약 카드 */}
          {summary && (summary.income > 0 || summary.expense > 0) && (
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-purple-700 text-sm">
                  {viewMode === 'month' ? '이번 달 요약' : '올해 요약'}
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="space-y-1.5 text-xs">
                  {summary.balance > 0 ? (
                    <p className="text-green-700">
                      🎉 {viewMode === 'month' ? '이번 달은' : '올해는'} <strong>{formatAmount(summary.balance)}원</strong>을 절약했습니다!
                    </p>
                  ) : summary.balance < 0 ? (
                    <p className="text-red-700">
                      ⚠️ {viewMode === 'month' ? '이번 달은' : '올해는'} <strong>{formatAmount(Math.abs(summary.balance))}원</strong> 적자입니다.
                    </p>
                  ) : (
                    <p className="text-gray-700">
                      💰 {viewMode === 'month' ? '이번 달은' : '올해는'} 수입과 지출이 균형을 이루고 있습니다.
                    </p>
                  )}

                  {viewMode === 'month' && savingsGoal && (summary?.savings || 0) >= Number(savingsGoal.goal_amount) && (
                    <p className="text-emerald-700">
                      🎯 저축 목표를 달성했습니다!
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