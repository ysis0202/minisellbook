import * as z from 'zod';

export const EntrySchema = z.object({
  kind: z.enum(['income', 'expense', 'savings']),
  amount: z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        return parseFloat(val.replace(/,/g, ''));
      }
      return val;
    },
    z.number().min(0, '금액은 0 이상이어야 합니다')
  ),
  entry_date: z.string().min(1, '날짜를 선택해주세요'),
  account_id: z.string().uuid('계정을 선택해주세요'),
  category_id: z.string().uuid('카테고리를 선택해주세요'),
  memo: z.string().max(200, '메모는 200자 이하로 입력해주세요').optional(),
  tags: z.array(z.string()).optional()
});

export type EntryFormData = z.infer<typeof EntrySchema>;