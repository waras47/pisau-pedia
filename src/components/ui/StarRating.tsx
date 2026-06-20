import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';
import { generateStars } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function StarRating({ rating, reviewCount, size = 'sm', className }: StarRatingProps) {
  const stars = generateStars(rating);

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {stars.map((type, i) => (
          <Star
            key={i}
            size={size === 'sm' ? 12 : 16}
            className={
              type === 'empty'
                ? 'fill-transparent text-[#555]'
                : 'fill-[#C9A84C] text-[#C9A84C]'
            }
          />
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="text-[#888] text-xs">({reviewCount.toLocaleString()})</span>
      )}
    </div>
  );
}
