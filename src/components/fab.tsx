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
        'fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-10',
        'bg-blue-600 hover:bg-blue-700 text-white',
        className
      )}
      aria-label="새 항목 추가"
    >
      <Plus className="w-6 h-6" />
    </Button>
  );
}