'use client';

import { useState } from 'react';
import { MonthSwitcher } from '@/components/month-switcher';
import { MonthCalendar } from '@/components/month-calendar';
import { DayList } from '@/components/day-list';
import { FAB } from '@/components/fab';
import { EntryModal } from '@/components/entry-modal';
import { useEntriesByDate } from '@/lib/hooks/use-entries';
import { EntryWithDetails } from '@/lib/types';
import { mutate } from 'swr';

export default function CalendarPage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.toISOString().slice(0, 7));
  const [selectedDate, setSelectedDate] = useState(today.toISOString().slice(0, 10));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<EntryWithDetails | null>(null);

  const { data: entries } = useEntriesByDate(selectedDate);

  const handleMonthChange = (month: string) => {
    setCurrentMonth(month);
    setSelectedDate(`${month}-01`);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
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
    mutate(['entries', selectedDate]);
    mutate(['month-summary', currentMonth]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-900">달력</h1>
          <p className="text-sm text-gray-500">월별 일정 및 가계부 관리</p>
        </div>
      </div>

      {/* 월 전환 */}
      <MonthSwitcher
        currentMonth={currentMonth}
        onMonthChange={handleMonthChange}
      />

      {/* 달력 (전체 화면) */}
      <div className="bg-white">
        <MonthCalendar
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />
      </div>

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