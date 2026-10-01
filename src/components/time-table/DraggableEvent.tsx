'use client';

import { useRef } from 'react';
import { differenceInDays } from 'date-fns';
import { CalendarEvent } from './types';
import { EventItem } from './EventItem';

interface DraggableEventProps {
  event: CalendarEvent;
  view: 'month' | 'week' | 'day';
  showTime?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  height?: number;
  isMultiDay?: boolean;
  multiDayWidth?: number;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  'aria-hidden'?: boolean | 'true' | 'false';
}

export function DraggableEvent({
  event,
  view,
  showTime,
  onClick,
  height,
  isMultiDay,
  multiDayWidth,
  isFirstDay = true,
  isLastDay = true,
  'aria-hidden': ariaHidden,
}: DraggableEventProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  // Check if this is a multi-day event
  const eventStart = new Date(event.start);
  const eventEnd = new Date(event.end);
  const isMultiDayEvent = isMultiDay || event.allDay || differenceInDays(eventEnd, eventStart) >= 1;

  const style = {
    height: height || 'auto',
    width: isMultiDayEvent && multiDayWidth ? `${multiDayWidth}%` : undefined,
  };

  return (
    <div ref={elementRef} style={style} className='touch-none'>
      <EventItem
        event={event}
        view={view}
        showTime={showTime}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        onClick={onClick}
        aria-hidden={ariaHidden}
      />
    </div>
  );
}
