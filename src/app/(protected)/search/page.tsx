'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Calendar } from 'lucide-react';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSearch = () => {
    // 검색 로직 구현 (추후)
    console.log('Search:', { searchQuery, startDate, endDate });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900">검색</h1>
          <p className="text-sm text-gray-500">항목을 검색하고 필터링하세요</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* 검색 필터 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              검색 옵션
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 키워드 검색 */}
            <div className="space-y-2">
              <label className="text-sm font-medium">키워드</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="메모나 카테고리명으로 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* 날짜 범위 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">시작일</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">종료일</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={handleSearch} className="w-full">
              <Search className="w-4 h-4 mr-2" />
              검색
            </Button>
          </CardContent>
        </Card>

        {/* 검색 결과 */}
        <Card>
          <CardHeader>
            <CardTitle>검색 결과</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>검색 기능은 추후 업데이트 예정입니다</p>
              <p className="text-sm mt-1">빠른 검색과 필터링을 위해 준비 중입니다</p>
            </div>
          </CardContent>
        </Card>

        {/* 빠른 필터 */}
        <Card>
          <CardHeader>
            <CardTitle>빠른 필터</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-16 flex-col">
                <Calendar className="w-5 h-5 mb-1" />
                <span className="text-sm">이번 주</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col">
                <Calendar className="w-5 h-5 mb-1" />
                <span className="text-sm">이번 달</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}