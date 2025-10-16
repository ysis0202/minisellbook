'use client';

import { cn } from '@/lib/utils';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isToday } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useMonthEntries } from '@/lib/hooks/use-entries';

interface MonthCalendarProps {
  currentMonth: string;
  selectedDate: string;
  onDateSelect: (date: string) => void;
  onDateDoubleClick?: (date: string) => void;
}

export function MonthCalendar({ currentMonth, selectedDate, onDateSelect, onDateDoubleClick }: MonthCalendarProps) {
  const monthStart = startOfMonth(new Date(currentMonth + '-01'));
  const monthEnd = endOfMonth(new Date(currentMonth + '-01'));
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const { data: monthEntries } = useMonthEntries(currentMonth);

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  // 첫 번째 주의 빈 칸들을 계산
  const startDayOfWeek = monthStart.getDay();
  const emptyDays = Array(startDayOfWeek).fill(null);

  const handleDateClick = (date: Date) => {
    const dateISO = format(date, 'yyyy-MM-dd');
    onDateSelect(dateISO);
  };

  const handleDateDoubleClick = (date: Date) => {
    const dateISO = format(date, 'yyyy-MM-dd');
    onDateDoubleClick?.(dateISO);
  };

  return (
    <div className="p-2.5 bg-white">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-1">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={cn(
              'text-center text-[11px] font-bold py-1.5',
              index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-600'
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 달력 그리드 - gap을 늘려서 반응형 화면에서 겹침 방지 */}
      <div className="grid grid-cols-7 gap-1.5">
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
              onDoubleClick={() => handleDateDoubleClick(date)}
              className={cn(
                'aspect-square flex flex-col items-center justify-center text-base font-medium transition-all duration-200 rounded-xl relative active:scale-95',
                'hover:bg-gray-100 min-h-[44px]',
                // scale-105 제거하고 ring과 shadow로만 선택 표시 (겹침 방지)
                isSelected && 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg ring-2 ring-emerald-400',
                isCurrentDay && !isSelected && 'bg-emerald-50 text-emerald-700 font-bold ring-2 ring-emerald-200',
                dayOfWeek === 0 && !isSelected && !isCurrentDay && 'text-red-500',
                dayOfWeek === 6 && !isSelected && !isCurrentDay && 'text-blue-500',
                !isSelected && !isCurrentDay && 'text-gray-700'
              )}
            >
              <span className="relative z-10 text-[15px]">
                {format(date, 'd')}
              </span>

              {/* 항목 있음을 나타내는 점 */}
              <div className="absolute bottom-1.5 flex gap-0.5">
                {monthEntries?.[dateISO] && (
                  <>
                    {monthEntries[dateISO].hasIncome && (
                      <div className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        isSelected ? 'bg-white/80' : 'bg-emerald-500'
                      )} />
                    )}
                    {monthEntries[dateISO].hasExpense && (
                      <div className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        isSelected ? 'bg-white/80' : 'bg-red-500'
                      )} />
                    )}
                    {monthEntries[dateISO].hasSavings && (
                      <div className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        isSelected ? 'bg-white/80' : 'bg-blue-500'
                      )} />
                    )}
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