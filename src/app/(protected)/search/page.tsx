'use client';

import { useState, useEffect } from 'react';
import { AppLogo } from '@/components/app-logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Calendar, TrendingUp, TrendingDown, Wallet, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { EntryWithDetails } from '@/lib/types';
import { format } from 'date-fns';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [results, setResults] = useState<EntryWithDetails[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const supabase = createClient();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const handleSearch = async () => {
    setIsSearching(true);
    setHasSearched(true);

    try {
      let query = supabase
        .from('entries')
        .select(`
          *,
          categories(name, kind, emoji),
          accounts(name)
        `)
        .is('deleted_at', null)
        .order('entry_date', { ascending: false });

      // 날짜 필터
      if (startDate) {
        query = query.gte('entry_date', startDate);
      }
      if (endDate) {
        query = query.lte('entry_date', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      // 클라이언트 사이드 검색 필터 (메모나 카테고리명)
      let filtered = data as EntryWithDetails[];
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(entry =>
          entry.memo?.toLowerCase().includes(query) ||
          entry.categories?.name?.toLowerCase().includes(query)
        );
      }

      setResults(filtered);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickFilter = (type: 'week' | 'month') => {
    const today = new Date();
    const end = format(today, 'yyyy-MM-dd');

    if (type === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      setStartDate(format(weekAgo, 'yyyy-MM-dd'));
      setEndDate(end);
    } else {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      setStartDate(format(monthAgo, 'yyyy-MM-dd'));
      setEndDate(end);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setResults([]);
    setHasSearched(false);
  };

  useEffect(() => {
    // 자동 검색 (디바운스 적용 가능)
    if (hasSearched) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, hasSearched]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
        <div className="px-4 pt-3 pb-2 flex justify-center">
          <AppLogo size="sm" />
        </div>
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Search className="w-5 h-5" />
            <h1 className="text-lg font-bold">검색</h1>
          </div>
          <p className="text-emerald-50 text-xs">거래 내역을 빠르게 찾아보세요</p>
        </div>
      </div>

      <div className="p-3 space-y-3">
        {/* 검색 필터 */}
        <Card>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="flex items-center gap-1.5 text-sm">
              <Filter className="w-4 h-4" />
              검색 옵션
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-3 pb-3">
            {/* 키워드 검색 */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium">키워드</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
                <Input
                  type="text"
                  placeholder="메모나 카테고리명"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
            </div>

            {/* 날짜 범위 */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">시작일</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">종료일</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSearch} className="flex-1 h-9" disabled={isSearching}>
                <Search className="w-3.5 h-3.5 mr-1.5" />
                {isSearching ? '검색 중...' : '검색'}
              </Button>
              {hasSearched && (
                <Button onClick={handleClearFilters} variant="outline" className="h-9 px-3">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 빠른 필터 */}
        <Card>
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm">빠른 필터</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-14 flex-col active:scale-95"
                onClick={() => handleQuickFilter('week')}
              >
                <Calendar className="w-4 h-4 mb-1" />
                <span className="text-xs">최근 7일</span>
              </Button>
              <Button
                variant="outline"
                className="h-14 flex-col active:scale-95"
                onClick={() => handleQuickFilter('month')}
              >
                <Calendar className="w-4 h-4 mb-1" />
                <span className="text-xs">최근 30일</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 검색 결과 */}
        {hasSearched && (
          <Card>
            <CardHeader className="pb-2 pt-3 px-3">
              <CardTitle className="text-sm">
                검색 결과 {results.length > 0 && `(${results.length}건)`}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3">
              {isSearching ? (
                <div className="text-center py-6">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-500 text-sm">검색 중...</p>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">검색 결과가 없습니다</p>
                  <p className="text-xs mt-1">다른 키워드나 날짜를 시도해보세요</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {results.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-2.5 bg-white border rounded-lg hover:shadow-sm transition-shadow active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="text-xl">{entry.categories?.emoji || '💰'}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-medium text-gray-900 text-sm">
                              {entry.categories?.name || '없음'}
                            </h3>
                            {entry.kind === 'income' ? (
                              <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                            ) : entry.kind === 'savings' ? (
                              <Wallet className="w-3.5 h-3.5 text-blue-600" />
                            ) : (
                              <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                            )}
                          </div>
                          {entry.memo && (
                            <p className="text-xs text-gray-500 truncate">{entry.memo}</p>
                          )}
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-0.5">
                            <span>{format(new Date(entry.entry_date), 'yyyy-MM-dd')}</span>
                            {entry.accounts?.name && (
                              <>
                                <span>•</span>
                                <span>{entry.accounts.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-2">
                        <div
                          className={`text-sm font-semibold ${
                            entry.kind === 'income' ? 'text-green-600' : entry.kind === 'savings' ? 'text-blue-600' : 'text-red-600'
                          }`}
                        >
                          {entry.kind === 'income' ? '+' : '-'}
                          {formatAmount(Number(entry.amount))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}