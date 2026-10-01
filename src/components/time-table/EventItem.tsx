'use client';

import { useMemo } from 'react';
import { differenceInMinutes, format, isPast } from 'date-fns';

import { cn } from '@/lib/utils';
import { CalendarEvent } from './types';
import { getBorderRadiusClasses, getEventColorClasses } from './utils';

// Using date-fns format with custom formatting:
// 'H' - hours (0-23) 24h format
// ':mm' - minutes
const formatTimeWithOptionalMinutes = (date: Date) => {
  return format(date, 'H:mm');
};

interface EventWrapperProps {
  event: CalendarEvent;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  children: React.ReactNode;
}

// Shared wrapper component for event styling
function EventWrapper({
  event,
  isFirstDay = true,
  isLastDay = true,
  onClick,
  className,
  children,
}: EventWrapperProps) {
  // Precrtaj event ako je u proslosti ili je otkazan
  const isEventInPast = isPast(new Date(event.end)) || event.status === 'CANCELLED';

  return (
    <button
      className={cn(
        'focus-visible:border-ring focus-visible:ring-ring/50 flex size-full overflow-hidden px-1 text-left font-medium backdrop-blur-md transition outline-none select-none focus-visible:ring-[3px] data-past-event:line-through sm:px-2',
        getEventColorClasses(event.color),
        getBorderRadiusClasses(isFirstDay, isLastDay),
        className
      )}
      data-past-event={isEventInPast || undefined}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

interface EventItemProps {
  event: CalendarEvent;
  view: 'month' | 'week' | 'day' | 'agenda';
  onClick?: (e: React.MouseEvent) => void;
  showTime?: boolean;
  isFirstDay?: boolean;
  isLastDay?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function EventItem({
  event,
  view,
  onClick,
  showTime,
  isFirstDay = true,
  isLastDay = true,
  children,
  className,
}: EventItemProps) {
  const eventColor = event.color;

  // Use the event's actual time
  const displayStart = useMemo(() => {
    return new Date(event.start);
  }, [event.start]);

  const displayEnd = useMemo(() => {
    return new Date(event.end);
  }, [event.end]);

  // Calculate event duration in minutes
  const durationMinutes = useMemo(() => {
    return differenceInMinutes(displayEnd, displayStart);
  }, [displayStart, displayEnd]);

  const getEventTime = () => {
    if (event.allDay) return 'Ceo dan';

    // For short events (less than 45 minutes), only show start time
    if (durationMinutes < 45) {
      return formatTimeWithOptionalMinutes(displayStart);
    }

    // For longer events, show both start and end time
    return `${formatTimeWithOptionalMinutes(displayStart)} - ${formatTimeWithOptionalMinutes(
      displayEnd
    )}`;
  };

  if (view === 'month') {
    return (
      <EventWrapper
        event={event}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        onClick={onClick}
        className={cn(
          'mt-[var(--event-gap)] h-[var(--event-height)] items-center text-[10px] sm:text-xs',
          className
        )}
      >
        {children || (
          <span className="truncate">
            {!event.allDay && (
              <span className="truncate font-normal opacity-70 sm:text-[11px]">
                {formatTimeWithOptionalMinutes(displayStart)}{' '}
              </span>
            )}
            {event.title}
          </span>
        )}
      </EventWrapper>
    );
  }

  if (view === 'week' || view === 'day') {
    return (
      <EventWrapper
        event={event}
        isFirstDay={isFirstDay}
        isLastDay={isLastDay}
        onClick={onClick}
        className={cn(
          'py-1',
          durationMinutes < 45 ? 'items-center' : 'flex-col',
          view === 'week' ? 'text-[10px] sm:text-xs' : 'text-xs',
          className
        )}
      >
        {durationMinutes < 45 ? (
          <div className="truncate">
            {event.title}{' '}
            {showTime && (
              <span className="opacity-70">{formatTimeWithOptionalMinutes(displayStart)}</span>
            )}
          </div>
        ) : (
          <>
            <div className="truncate font-medium">{event.title}</div>
            {showTime && (
              <div className="truncate font-normal opacity-70 sm:text-[11px]">{getEventTime()}</div>
            )}
          </>
        )}
      </EventWrapper>
    );
  }

  // Agenda view - kept separate since it's significantly different
  return (
    <button
      className={cn(
        'focus-visible:border-ring focus-visible:ring-ring/50 flex w-full flex-col gap-1 rounded p-2 text-left transition outline-none focus-visible:ring-[3px] data-past-event:line-through data-past-event:opacity-90',
        getEventColorClasses(eventColor),
        className
      )}
      data-past-event={isPast(new Date(event.end)) || undefined}
      onClick={onClick}
    >
      <div className="text-sm font-medium">{event.title}</div>
      <div className="text-xs opacity-70">
        {event.allDay ? (
          <span>Ceo dan</span>
        ) : (
          <span className="uppercase">
            {formatTimeWithOptionalMinutes(displayStart)} -{' '}
            {formatTimeWithOptionalMinutes(displayEnd)}
          </span>
        )}
        {event.location && (
          <>
            <span className="px-1 opacity-35"> · </span>
            <span>{event.location}</span>
          </>
        )}
      </div>
      {/* {event.description && <div className='my-1 text-xs opacity-90'>{event.description}</div>} */}
    </button>
  );
}
