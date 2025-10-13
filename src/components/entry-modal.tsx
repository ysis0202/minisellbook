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
  const [selectedKind, setSelectedKind] = useState<'income' | 'expense'>('expense');

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
      form.reset({
        kind: entry.kind,
        amount: Number(entry.amount),
        entry_date: entry.entry_date,
        account_id: entry.account_id || '',
        category_id: entry.category_id || '',
        memo: entry.memo || '',
      });
    } else {
      // 기본값으로 리셋
      const defaultAccount = accounts?.find(acc => acc.is_default);
      const defaultCategory = categories?.find(cat => cat.kind === selectedKind);

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

  const handleKindChange = (kind: 'income' | 'expense') => {
    setSelectedKind(kind);
    form.setValue('kind', kind);

    // 카테고리를 해당 종류의 첫 번째로 자동 선택
    const defaultCategory = categories?.find(cat => cat.kind === kind);
    if (defaultCategory) {
      form.setValue('category_id', defaultCategory.id);
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

  const formatAmount = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('ko-KR').format(Number(number));
  };

  const filteredCategories = categories?.filter(cat => cat.kind === selectedKind) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{entry ? '항목 수정' : '새 항목 추가'}</span>
            {entry && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={loading}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* 수입/지출 토글 */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={selectedKind === 'expense' ? 'default' : 'outline'}
              onClick={() => handleKindChange('expense')}
              className="flex-1"
            >
              지출
            </Button>
            <Button
              type="button"
              variant={selectedKind === 'income' ? 'default' : 'outline'}
              onClick={() => handleKindChange('income')}
              className="flex-1"
            >
              수입
            </Button>
          </div>

          {/* 금액 */}
          <div className="space-y-2">
            <Label htmlFor="amount">금액</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="amount"
                type="text"
                placeholder="0"
                className="pl-10 text-right text-lg font-bold"
                {...form.register('amount', {
                  setValueAs: (value) => {
                    const number = value.replace(/[^\d]/g, '');
                    return Number(number);
                  },
                })}
                onChange={(e) => {
                  const formatted = formatAmount(e.target.value);
                  e.target.value = formatted;
                  form.setValue('amount', Number(e.target.value.replace(/[^\d]/g, '')));
                }}
              />
            </div>
            {form.formState.errors.amount && (
              <p className="text-red-500 text-sm">{form.formState.errors.amount.message}</p>
            )}
          </div>

          {/* 카테고리 */}
          <div className="space-y-2">
            <Label htmlFor="category">카테고리</Label>
            <Select
              value={form.watch('category_id')}
              onValueChange={(value) => form.setValue('category_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <span className="flex items-center gap-2">
                      <span>{category.emoji}</span>
                      <span>{category.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.category_id && (
              <p className="text-red-500 text-sm">{form.formState.errors.category_id.message}</p>
            )}
          </div>

          {/* 계정 */}
          <div className="space-y-2">
            <Label htmlFor="account">계정</Label>
            <Select
              value={form.watch('account_id')}
              onValueChange={(value) => form.setValue('account_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="계정 선택" />
              </SelectTrigger>
              <SelectContent>
                {accounts?.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <span className="flex items-center gap-2">
                      <span>{account.name}</span>
                      {account.is_default && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-1 py-0.5 rounded">
                          기본
                        </span>
                      )}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.account_id && (
              <p className="text-red-500 text-sm">{form.formState.errors.account_id.message}</p>
            )}
          </div>

          {/* 날짜 */}
          <div className="space-y-2">
            <Label htmlFor="date">날짜</Label>
            <Input
              id="date"
              type="date"
              {...form.register('entry_date')}
            />
            {form.formState.errors.entry_date && (
              <p className="text-red-500 text-sm">{form.formState.errors.entry_date.message}</p>
            )}
          </div>

          {/* 메모 */}
          <div className="space-y-2">
            <Label htmlFor="memo">메모 (선택)</Label>
            <Input
              id="memo"
              type="text"
              placeholder="메모를 입력하세요"
              {...form.register('memo')}
            />
            {form.formState.errors.memo && (
              <p className="text-red-500 text-sm">{form.formState.errors.memo.message}</p>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? '저장 중...' : entry ? '수정' : '추가'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}