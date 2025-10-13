'use client';

import { useState } from 'react';
import { TopSummary } from '@/components/top-summary';
import { MonthSwitcher } from '@/components/month-switcher';
import { MonthCalendar } from '@/components/month-calendar';
import { DayList } from '@/components/day-list';
import { FAB } from '@/components/fab';
import { EntryModal } from '@/components/entry-modal';
import { useEntriesByDate } from '@/lib/hooks/use-entries';
import { EntryWithDetails } from '@/lib/types';
import { mutate } from 'swr';

export default function HomePage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.toISOString().slice(0, 7)); // YYYY-MM
  const [selectedDate, setSelectedDate] = useState(today.toISOString().slice(0, 10)); // YYYY-MM-DD
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleAddEntry = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const handleEditEntry = (entryId: string) => {
    const entry = entries?.find(e => e.id === entryId);
    if (entry) {
      setEditingEntry(entry);
      setIsModalOpen(true);
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 월 요약 */}
      <TopSummary month={currentMonth} />

      {/* 월 전환 */}
      <MonthSwitcher
        currentMonth={currentMonth}
        onMonthChange={handleMonthChange}
      />

      {/* 달력 */}
      <MonthCalendar
        currentMonth={currentMonth}
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
      />

      {/* 선택된 날짜의 항목 리스트 */}
      <DayList
        selectedDate={selectedDate}
        onEditEntry={handleEditEntry}
      />

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
    </div>
  );
}