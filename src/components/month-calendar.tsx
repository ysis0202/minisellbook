'use client';

import { cn } from '@/lib/utils';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';

interface MonthCalendarProps {
  currentMonth: string;
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export function MonthCalendar({ currentMonth, selectedDate, onDateSelect }: MonthCalendarProps) {
  const monthStart = startOfMonth(new Date(currentMonth + '-01'));
  const monthEnd = endOfMonth(new Date(currentMonth + '-01'));
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  // 첫 번째 주의 빈 칸들을 계산
  const startDayOfWeek = monthStart.getDay();
  const emptyDays = Array(startDayOfWeek).fill(null);

  const handleDateClick = (date: Date) => {
    const dateISO = format(date, 'yyyy-MM-dd');
    onDateSelect(dateISO);
  };

  return (
    <div className="p-4 bg-white">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={cn(
              'text-center text-sm font-medium py-2',
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-500'
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 달력 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {/* 빈 칸들 */}
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* 날짜들 */}
        {days.map((date) => {
          const dateISO = format(date, 'yyyy-MM-dd');
          const isSelected = dateISO === selectedDate;
          const isCurrentDay = isToday(date);
          const dayOfWeek = date.getDay();

          return (
            <button
              key={dateISO}
              onClick={() => handleDateClick(date)}
              className={cn(
                'aspect-square flex flex-col items-center justify-center text-sm transition-all duration-150 rounded-lg relative',
                'hover:bg-gray-100',
                isSelected && 'bg-blue-500 text-white hover:bg-blue-600',
                isCurrentDay && !isSelected && 'bg-blue-50 text-blue-600 font-semibold',
                dayOfWeek === 0 && !isSelected && !isCurrentDay && 'text-red-500',
                dayOfWeek === 6 && !isSelected && !isCurrentDay && 'text-blue-500'
              )}
            >
              <span className="relative z-10">
                {format(date, 'd')}
              </span>

              {/* 항목 있음을 나타내는 점 (나중에 구현) */}
              <div className="absolute bottom-1 flex gap-0.5">
                {/* 임시로 몇 개 날짜에 점 표시 */}
                {(date.getDate() % 3 === 0 || date.getDate() % 7 === 0) && (
                  <>
                    <div className={cn(
                      'w-1 h-1 rounded-full',
                      isSelected ? 'bg-white' : 'bg-green-500'
                    )} />
                    <div className={cn(
                      'w-1 h-1 rounded-full',
                      isSelected ? 'bg-white' : 'bg-red-500'
                    )} />
                  </>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}