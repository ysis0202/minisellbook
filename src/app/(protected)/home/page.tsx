'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppLogo } from '@/components/app-logo';
import { TopSummary } from '@/components/top-summary';
import { MonthSwitcher } from '@/components/month-switcher';
import { MonthCalendar } from '@/components/month-calendar';
import { DayList } from '@/components/day-list';
import { FAB } from '@/components/fab';
import { EntryModal } from '@/components/entry-modal';
import { DateEntriesModal } from '@/components/date-entries-modal';
import { useEntriesByDate } from '@/lib/hooks/use-entries';
import { EntryWithDetails } from '@/lib/types';
import { mutate } from 'swr';
import { deleteEntry } from '@/server/actions';
import { toast } from 'sonner';

function HomeContent() {
  const searchParams = useSearchParams();
  const monthParam = searchParams.get('month');

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(monthParam || today.toISOString().slice(0, 7)); // YYYY-MM
  const [selectedDate, setSelectedDate] = useState(
    monthParam ? `${monthParam}-01` : today.toISOString().slice(0, 10)
  ); // YYYY-MM-DD

  // URL 쿼리 파라미터가 변경되면 월 업데이트
  useEffect(() => {
    if (monthParam && monthParam !== currentMonth) {
      setCurrentMonth(monthParam);
      setSelectedDate(`${monthParam}-01`);
    }
  }, [monthParam, currentMonth]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<EntryWithDetails | null>(null);

  const { data: entries } = useEntriesByDate(selectedDate);

  const handleMonthChange = (month: string) => {
    setCurrentMonth(month);
    // 월이 바뀌면 해당 월의 1일로 선택 날짜 변경
    setSelectedDate(`${month}-01`);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    // 선택한 날짜가 현재 월과 다르면 월도 변경
    const selectedMonth = date.slice(0, 7);
    if (selectedMonth !== currentMonth) {
      setCurrentMonth(selectedMonth);
    }
  };

  const handleDateDoubleClick = (date: string) => {
    setSelectedDate(date);
    setIsDateModalOpen(true);
  };

  const handleAddEntry = () => {
    setEditingEntry(null);
    setIsDateModalOpen(false);
    setIsModalOpen(true);
  };

  const handleEditEntry = (entry: EntryWithDetails) => {
    setEditingEntry(entry);
    setIsDateModalOpen(false);
    setIsModalOpen(true);
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      const result = await deleteEntry(entryId);
      if (result.success) {
        toast.success('항목이 삭제되었습니다');
        mutate(['entries', selectedDate]);
        mutate(['month-summary', currentMonth]);
        mutate(['month-entries', currentMonth]);
      } else {
        toast.error(result.error || '삭제에 실패했습니다');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('삭제에 실패했습니다');
    }
  };

  const handleEditEntryById = (entryId: string) => {
    const entry = entries?.find(e => e.id === entryId);
    if (entry) {
      handleEditEntry(entry);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
  };

  const handleModalSuccess = () => {
    // SWR 캐시 갱신
    mutate(['entries', selectedDate]);
    mutate(['month-summary', currentMonth]);
    mutate(['month-entries', currentMonth]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 상단 고정 영역 */}
      <div className="sticky top-0 z-20 shadow-sm">
        {/* 로고 */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-4 pt-3 pb-2 flex justify-center">
          <AppLogo size="sm" />
        </div>
        
        {/* 월 요약 */}
        <TopSummary month={currentMonth} />
        
        {/* 월 전환 */}
        <div className="bg-white border-b px-4 py-2">
          <MonthSwitcher
            currentMonth={currentMonth}
            onMonthChange={handleMonthChange}
          />
        </div>
      </div>

      {/* 달력 */}
      <div className="bg-white mb-2">
        <MonthCalendar
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onDateDoubleClick={handleDateDoubleClick}
        />
      </div>

      {/* 선택된 날짜의 항목 리스트 */}
      <div className="px-3">
        <DayList
          selectedDate={selectedDate}
          onEditEntry={handleEditEntryById}
        />
      </div>

      {/* FAB */}
      <FAB onClick={handleAddEntry} />

      {/* Entry Modal */}
      <EntryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        selectedDate={selectedDate}
        entry={editingEntry}
        onSuccess={handleModalSuccess}
      />

      {/* Date Entries Modal */}
      <DateEntriesModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        date={selectedDate}
        entries={entries || []}
        onEditEntry={handleEditEntry}
        onDeleteEntry={handleDeleteEntry}
        onAddEntry={handleAddEntry}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-gray-500">로딩 중...</p>
      </div>
    </div>}>
      <HomeContent />
    </Suspense>
  );
}