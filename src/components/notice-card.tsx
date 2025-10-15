import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { Notice } from '@/lib/hooks/use-notices';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface NoticeCardProps {
  notice: Notice;
}

export function NoticeCard({ notice }: NoticeCardProps) {
  const getTypeStyle = (type: Notice['type']) => {
    switch (type) {
      case 'event':
        return {
          bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
          border: 'border-purple-200',
          badge: 'bg-purple-100 text-purple-700',
          badgeText: '이벤트',
        };
      case 'update':
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
          border: 'border-blue-200',
          badge: 'bg-blue-100 text-blue-700',
          badgeText: '업데이트',
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
          border: 'border-emerald-200',
          badge: 'bg-emerald-100 text-emerald-700',
          badgeText: '공지',
        };
    }
  };

  const style = getTypeStyle(notice.type);

  const handleClick = () => {
    if (notice.link) {
      window.open(notice.link, '_blank');
    }
  };

  return (
    <Card
      className={`${style.bg} ${style.border} border transition-all duration-200 ${
        notice.link ? 'cursor-pointer hover:shadow-md active:scale-[0.98]' : ''
      }`}
      onClick={handleClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2.5">
          {/* 이모지 */}
          <div className="text-2xl leading-none mt-0.5 flex-shrink-0">
            {notice.emoji}
          </div>

          {/* 내용 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${style.badge}`}>
                {style.badgeText}
              </span>
              <span className="text-[9px] text-gray-500">
                {format(new Date(notice.created_at), 'M월 d일', { locale: ko })}
              </span>
            </div>
            
            <h3 className="font-semibold text-sm mb-1 line-clamp-1">
              {notice.title}
            </h3>
            
            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
              {notice.content}
            </p>

            {notice.expires_at && (
              <div className="mt-1.5 text-[9px] text-gray-400 flex items-center gap-1">
                <span>⏰</span>
                <span>
                  {format(new Date(notice.expires_at), 'M월 d일까지', { locale: ko })}
                </span>
              </div>
            )}
          </div>

          {/* 링크 아이콘 */}
          {notice.link && (
            <div className="flex-shrink-0">
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

