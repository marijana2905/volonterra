'use client';

import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { srLatn } from 'date-fns/locale';

interface Props {
  from?: Date | string;
  to?: Date | string;
  className?: string;
}

const ReadOnlyRangeCalendar = ({ from, to, className }: Props) => {
  return (
    <div className={cn('relative', className)}>
      <Calendar
        mode="range"
        selected={{
          from: from ? new Date(from) : undefined,
          to: to ? new Date(to) : undefined,
        }}
        locale={srLatn}
        onSelect={() => {}}
        className={cn('w-full', className)}
      />
    </div>
  );
};

export default ReadOnlyRangeCalendar;
