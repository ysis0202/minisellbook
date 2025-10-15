'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FABProps {
  onClick: () => void;
  className?: string;
}

export function FAB({ onClick, className }: FABProps) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(
        'fixed bottom-20 right-5 h-16 w-16 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 z-20',
        'bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white',
        className
      )}
      aria-label="새 항목 추가"
    >
      <Plus className="w-7 h-7 stroke-[2.5]" />
    </Button>
  );
}