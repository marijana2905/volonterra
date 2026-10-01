'use client';

import React, { useMemo, useState } from 'react';
import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

type StarRatingProps = {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  readOnly?: boolean;
  className?: string;
  size?: number;
  onBlur?: () => void;
};

const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
  ({ value, onChange, max = 5, readOnly = false, className, size = 24, onBlur }, ref) => {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const stars = useMemo(() => Array.from({ length: max }), [max]);
    const clampedValue = Math.max(0, Math.min(Number.isFinite(value) ? value : 0, max));
    const displayValue = hoverValue ?? clampedValue;

    const handleStarClick = (index: number) => {
      if (readOnly) return;
      onChange?.(index + 1);
    };

    const handleMouseEnter = (index: number) => {
      if (readOnly) return;
      setHoverValue(index + 1);
    };

    const handleMouseLeave = () => {
      if (readOnly) return;
      setHoverValue(null);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (readOnly) return;

      const actions: Record<string, () => void> = {
        ArrowRight: () => onChange?.(Math.min(max, index + 2)),
        ArrowUp: () => onChange?.(Math.min(max, index + 2)),
        ArrowLeft: () => onChange?.(Math.max(1, index)),
        ArrowDown: () => onChange?.(Math.max(1, index)),
        Home: () => onChange?.(1),
        End: () => onChange?.(max),
      };

      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        onChange?.(index + 1);
        return;
      }

      const action = actions[event.key];
      if (action) {
        event.preventDefault();
        action();
      }
    };

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-1', className)}
        role={readOnly ? 'img' : 'radiogroup'}
        aria-label="Ocena"
        onMouseLeave={handleMouseLeave}
      >
        {stars.map((_, index) => {
          const isActive = index < displayValue;

          return (
            <button
              key={index}
              type="button"
              className={cn(
                'focus-visible:ring-ring transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                readOnly ? 'cursor-default' : 'cursor-pointer'
              )}
              onMouseEnter={() => handleMouseEnter(index)}
              onClick={() => handleStarClick(index)}
              onBlur={onBlur}
              onKeyDown={event => handleKeyDown(event, index)}
              aria-label={`Ocena ${index + 1}`}
              role={readOnly ? undefined : 'radio'}
              aria-checked={value === index + 1}
              tabIndex={
                readOnly ? -1 : value === index + 1 || (value === 0 && index === 0) ? 0 : -1
              }
              disabled={readOnly}
            >
              <Star
                className={cn(
                  'transition-colors',
                  isActive ? 'text-yellow-500' : 'text-muted-foreground'
                )}
                strokeWidth={1}
                fill={isActive ? 'currentColor' : 'none'}
                width={size}
                height={size}
              />
            </button>
          );
        })}
      </div>
    );
  }
);

StarRating.displayName = 'StarRating';

export default StarRating;
