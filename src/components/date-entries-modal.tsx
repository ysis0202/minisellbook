'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EntryWithDetails } from '@/lib/types';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface DateEntriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  entries: EntryWithDetails[];
  onEditEntry: (entry: EntryWithDetails) => void;
  onDeleteEntry: (entryId: string) => void;
  onAddEntry?: () => void;
}

export function DateEntriesModal({
  isOpen,
  onClose,
  date,
  entries,
  onEditEntry,
  onDeleteEntry,
  onAddEntry,
}: DateEntriesModalProps) {
  const formattedDate = format(new Date(date), 'yyyy년 M월 d일 (E)', { locale: ko });

  const incomeEntries = entries.filter(e => e.kind === 'income');
  const expenseEntries = entries.filter(e => e.kind === 'expense');
  const savingsEntries = entries.filter(e => e.kind === 'savings');

  const totalIncome = incomeEntries.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalExpense = expenseEntries.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalSavings = savingsEntries.reduce((sum, e) => sum + Number(e.amount), 0);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const handleDelete = (entryId: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      onDeleteEntry(entryId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-3 p-0 gap-0 max-h-[85vh] flex flex-col">
        <DialogHeader className="px-4 pt-4 pb-3 border-b">
          <DialogTitle className="text-base">{formattedDate}</DialogTitle>
        </DialogHeader>

        <div className="px-4 py-3 space-y-3 overflow-y-auto flex-1">
          {/* 요약 */}
          <div className="grid grid-cols-3 gap-2">
            <Card className="p-2.5 bg-emerald-50 border-emerald-200">
              <div className="text-[10px] text-emerald-600 font-medium">수입</div>
              <div className="text-base font-bold text-emerald-700">
                +{formatAmount(totalIncome)}
              </div>
            </Card>
            <Card className="p-2.5 bg-red-50 border-red-200">
              <div className="text-[10px] text-red-600 font-medium">지출</div>
              <div className="text-base font-bold text-red-700">
                -{formatAmount(totalExpense)}
              </div>
            </Card>
            <Card className="p-2.5 bg-blue-50 border-blue-200">
              <div className="text-[10px] text-blue-600 font-medium">저축</div>
              <div className="text-base font-bold text-blue-700">
                -{formatAmount(totalSavings)}
              </div>
            </Card>
          </div>

          {/* 항목 추가 버튼 */}
          {onAddEntry && (
            <div className="flex justify-end">
              <Button
                onClick={onAddEntry}
                size="sm"
                className="gap-1 bg-emerald-500 hover:bg-emerald-600 text-white h-8 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                추가
              </Button>
            </div>
          )}

          {/* 수입 항목 */}
          {incomeEntries.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="font-semibold text-emerald-600 text-xs">수입</h3>
              {incomeEntries.map((entry) => (
                <Card key={entry.id} className="p-2 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <span className="text-lg">{entry.categories?.emoji || '💰'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{entry.categories?.name || '미분류'}</div>
                        {entry.memo && (
                          <div className="text-xs text-gray-500 truncate">{entry.memo}</div>
                        )}
                        <div className="text-[10px] text-gray-400">{entry.accounts?.name || '계정'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <div className="text-sm font-bold text-emerald-600">
                        +{formatAmount(Number(entry.amount))}
                      </div>
                      <div className="flex gap-0.5">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onEditEntry(entry)}
                          className="h-7 w-7"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(entry.id)}
                          className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* 지출 항목 */}
          {expenseEntries.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="font-semibold text-red-600 text-xs">지출</h3>
              {expenseEntries.map((entry) => (
                <Card key={entry.id} className="p-2 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <span className="text-lg">{entry.categories?.emoji || '💸'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{entry.categories?.name || '미분류'}</div>
                        {entry.memo && (
                          <div className="text-xs text-gray-500 truncate">{entry.memo}</div>
                        )}
                        <div className="text-[10px] text-gray-400">{entry.accounts?.name || '계정'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <div className="text-sm font-bold text-red-600">
                        -{formatAmount(Number(entry.amount))}
                      </div>
                      <div className="flex gap-0.5">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onEditEntry(entry)}
                          className="h-7 w-7"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(entry.id)}
                          className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* 저축 항목 */}
          {savingsEntries.length > 0 && (
            <div className="space-y-1.5">
              <h3 className="font-semibold text-blue-600 text-xs">저축</h3>
              {savingsEntries.map((entry) => (
                <Card key={entry.id} className="p-2 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <span className="text-lg">{entry.categories?.emoji || '💎'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{entry.categories?.name || '미분류'}</div>
                        {entry.memo && (
                          <div className="text-xs text-gray-500 truncate">{entry.memo}</div>
                        )}
                        <div className="text-[10px] text-gray-400">{entry.accounts?.name || '계정'}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <div className="text-sm font-bold text-blue-600">
                        -{formatAmount(Number(entry.amount))}
                      </div>
                      <div className="flex gap-0.5">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onEditEntry(entry)}
                          className="h-7 w-7"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDelete(entry.id)}
                          className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {entries.length === 0 && (
            <div className="text-center py-6 text-gray-400 text-sm">
              이 날짜에 기록된 항목이 없습니다
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t">
          <Button onClick={onClose} variant="outline" className="w-full h-9 text-sm">
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
