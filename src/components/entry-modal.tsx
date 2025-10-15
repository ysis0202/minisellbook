'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EntrySchema, type EntryFormData } from '@/lib/schemas';
import { useAccounts, useCategories } from '@/lib/hooks/use-entries';
import { createEntry, updateEntry, deleteEntry } from '@/server/actions';
import { EntryWithDetails } from '@/lib/types';
import { Trash2, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface EntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  entry?: EntryWithDetails | null;
  onSuccess?: () => void;
}

export function EntryModal({ isOpen, onClose, selectedDate, entry, onSuccess }: EntryModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedKind, setSelectedKind] = useState<'income' | 'expense' | 'savings'>('expense');
  const [displayAmount, setDisplayAmount] = useState('');

  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();

  const form = useForm<EntryFormData>({
    resolver: zodResolver(EntrySchema),
    defaultValues: {
      kind: 'expense',
      amount: 0,
      entry_date: selectedDate,
      account_id: '',
      category_id: '',
      memo: '',
    },
  });

  // 수정 모드일 때 폼 데이터 설정
  useEffect(() => {
    if (entry) {
      setSelectedKind(entry.kind);
      const amount = Number(entry.amount);
      setDisplayAmount(amount > 0 ? new Intl.NumberFormat('ko-KR').format(amount) : '');
      form.reset({
        kind: entry.kind,
        amount: amount,
        entry_date: entry.entry_date,
        account_id: entry.account_id || '',
        category_id: entry.category_id || '',
        memo: entry.memo || '',
      });
    } else {
      // 기본값으로 리셋
      const defaultAccount = accounts?.find(acc => acc.is_default);
      const defaultCategory = categories?.find(cat => cat.kind === selectedKind);

      setDisplayAmount('');
      form.reset({
        kind: selectedKind,
        amount: 0,
        entry_date: selectedDate,
        account_id: defaultAccount?.id || '',
        category_id: defaultCategory?.id || '',
        memo: '',
      });
    }
  }, [entry, selectedDate, selectedKind, accounts, categories, form]);

  const handleKindChange = (kind: 'income' | 'expense' | 'savings') => {
    setSelectedKind(kind);
    form.setValue('kind', kind);

    // 카테고리를 해당 종류의 첫 번째로 자동 선택
    const defaultCategory = categories?.find(cat => cat.kind === kind);
    if (defaultCategory) {
      form.setValue('category_id', defaultCategory.id);
    } else if (kind === 'savings') {
      // 저축 카테고리가 없으면 경고
      console.warn('저축 카테고리가 없습니다. DB 스키마를 확인하세요.');
      toast.error('저축 카테고리가 없습니다. 관리자에게 문의하세요.');
    }
  };

  const handleSubmit = async (data: EntryFormData) => {
    setLoading(true);
    try {
      let result;

      if (entry) {
        result = await updateEntry(entry.id, data);
      } else {
        result = await createEntry(data);
      }

      if (result.success) {
        toast.success(entry ? '항목이 수정되었습니다' : '항목이 추가되었습니다');
        onSuccess?.();
        onClose();
      } else {
        toast.error(result.error || '오류가 발생했습니다');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!entry) return;

    if (!confirm('정말 삭제하시겠습니까?')) return;

    setLoading(true);
    try {
      const result = await deleteEntry(entry.id);

      if (result.success) {
        toast.success('항목이 삭제되었습니다');
        onSuccess?.();
        onClose();
      } else {
        toast.error(result.error || '삭제에 실패했습니다');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('삭제에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories?.filter(cat => cat.kind === selectedKind) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-3 p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-3 border-b">
          <DialogTitle className="text-base">
            {entry ? '항목 수정' : '새 항목 추가'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="px-4 py-3 space-y-3">
          {/* 수입/지출/저축 토글 */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant={selectedKind === 'income' ? 'default' : 'outline'}
              onClick={() => handleKindChange('income')}
              className={`h-9 text-sm ${selectedKind === 'income' ? 'bg-green-600 hover:bg-green-700' : ''}`}
            >
              수입
            </Button>
            <Button
              type="button"
              variant={selectedKind === 'expense' ? 'default' : 'outline'}
              onClick={() => handleKindChange('expense')}
              className={`h-9 text-sm ${selectedKind === 'expense' ? 'bg-red-600 hover:bg-red-700' : ''}`}
            >
              지출
            </Button>
            <Button
              type="button"
              variant={selectedKind === 'savings' ? 'default' : 'outline'}
              onClick={() => handleKindChange('savings')}
              className={`h-9 text-sm ${selectedKind === 'savings' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
            >
              저축
            </Button>
          </div>

          {/* 금액 */}
          <div className="space-y-1.5">
            <Label htmlFor="amount" className="text-xs">금액</Label>
            <div className="relative">
              <DollarSign className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <Input
                id="amount"
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={displayAmount}
                className="pl-9 text-right text-base font-bold h-10"
                onChange={(e) => {
                  const input = e.target.value;
                  const numbersOnly = input.replace(/[^\d]/g, '');
                  const formatted = numbersOnly ? new Intl.NumberFormat('ko-KR').format(Number(numbersOnly)) : '';
                  setDisplayAmount(formatted);
                  form.setValue('amount', Number(numbersOnly) || 0);
                }}
              />
            </div>
            {form.formState.errors.amount && (
              <p className="text-red-500 text-xs">{form.formState.errors.amount.message}</p>
            )}
          </div>

          {/* 카테고리 - 저축이 아닐 때만 표시 */}
          {selectedKind !== 'savings' && (
            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-xs">카테고리</Label>
              <Select
                value={form.watch('category_id')}
                onValueChange={(value) => form.setValue('category_id', value)}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <span className="flex items-center gap-1.5 text-sm">
                        <span className="text-base">{category.emoji}</span>
                        <span>{category.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.category_id && (
                <p className="text-red-500 text-xs">{form.formState.errors.category_id.message}</p>
              )}
            </div>
          )}

          {/* 저축일 때 안내 메시지 */}
          {selectedKind === 'savings' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">💰</span>
                <p className="text-xs text-blue-700">
                  저축 항목으로 자동 분류됩니다
                </p>
              </div>
            </div>
          )}

          {/* 계정 */}
          <div className="space-y-1.5">
            <Label htmlFor="account" className="text-xs">계정</Label>
            <Select
              value={form.watch('account_id')}
              onValueChange={(value) => form.setValue('account_id', value)}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue placeholder="계정 선택" />
              </SelectTrigger>
              <SelectContent>
                {accounts?.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <span className="flex items-center gap-1.5 text-sm">
                      <span>{account.name}</span>
                      {account.is_default && (
                        <span className="text-[10px] bg-blue-100 text-blue-600 px-1 py-0.5 rounded">
                          기본
                        </span>
                      )}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.account_id && (
              <p className="text-red-500 text-xs">{form.formState.errors.account_id.message}</p>
            )}
          </div>

          {/* 날짜 */}
          <div className="space-y-1.5">
            <Label htmlFor="date" className="text-xs">날짜</Label>
            <Input
              id="date"
              type="date"
              className="h-9 text-sm"
              {...form.register('entry_date')}
            />
            {form.formState.errors.entry_date && (
              <p className="text-red-500 text-xs">{form.formState.errors.entry_date.message}</p>
            )}
          </div>

          {/* 메모 */}
          <div className="space-y-1.5">
            <Label htmlFor="memo" className="text-xs">메모 (선택)</Label>
            <Input
              id="memo"
              type="text"
              placeholder="메모를 입력하세요"
              className="h-9 text-sm"
              {...form.register('memo')}
            />
            {form.formState.errors.memo && (
              <p className="text-red-500 text-xs">{form.formState.errors.memo.message}</p>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 pt-2 border-t">
            {entry && (
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                disabled={loading}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 h-9 text-sm"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                삭제
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 h-9 text-sm"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-9 text-sm"
            >
              {loading ? '저장 중...' : entry ? '수정' : '추가'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}