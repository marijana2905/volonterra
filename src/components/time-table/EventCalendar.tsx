'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  isSameMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from 'date-fns';
import {
  CalendarCheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CalendarEvent, CalendarView } from './types';
import { AgendaDaysToShow, EventGap, EventHeight, WeekCellsHeight } from './constants';

import { MonthView } from './views/MonthView';
import { WeekView } from './views/WeekView';
import { DayView } from './views/DayView';
import { AgendaView } from './views/AgendaView';

import { srLatn } from 'date-fns/locale';
import { EventDialog } from './EventDialog';

export interface EventCalendarProps {
  events?: CalendarEvent[];
  className?: string;
  initialView?: CalendarView;
}

export function EventCalendar({
  events = [],
  className,
  initialView = 'month',
}: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>(initialView);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Add keyboard shortcuts for view switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input, textarea or contentEditable element
      // or if the event dialog is open
      if (
        isEventDialogOpen ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'm':
          setView('month');
          break;
        case 's':
          setView('week');
          break;
        case 'd':
          setView('day');
          break;
        case 'a':
          setView('agenda');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEventDialogOpen]);

  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (view === 'day') {
      setCurrentDate(addDays(currentDate, -1));
    } else if (view === 'agenda') {
      // For agenda view, go back 30 days (a full month)
      setCurrentDate(addDays(currentDate, -AgendaDaysToShow));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (view === 'day') {
      setCurrentDate(addDays(currentDate, 1));
    } else if (view === 'agenda') {
      // For agenda view, go forward 30 days (a full month)
      setCurrentDate(addDays(currentDate, AgendaDaysToShow));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventSelect = (event: CalendarEvent) => {
    console.log('Event selected:', event); // Debug log
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const getTextFromView = (view: CalendarView) => {
    switch (view) {
      case 'month':
        return 'Mesec';
      case 'week':
        return 'Sedmica';
      case 'day':
        return 'Dan';
      case 'agenda':
        return 'Agenda';
      default:
        return '';
    }
  };

  const viewTitle = useMemo(() => {
    if (view === 'month') {
      return format(currentDate, 'MMMM yyyy', { locale: srLatn });
    } else if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      if (isSameMonth(start, end)) {
        return format(start, 'MMMM yyyy', { locale: srLatn });
      } else {
        return `${format(start, 'MMM', { locale: srLatn })} - ${format(end, 'MMM yyyy', {
          locale: srLatn,
        })}`;
      }
    } else if (view === 'day') {
      return (
        <>
          <span className="min-[480px]:hidden" aria-hidden="true">
            {format(currentDate, 'MMM d, yyyy', { locale: srLatn })}
          </span>
          <span className="max-[479px]:hidden min-md:hidden" aria-hidden="true">
            {format(currentDate, 'MMMM d, yyyy', { locale: srLatn })}
          </span>
          <span className="max-md:hidden">
            {format(currentDate, 'EEE MMMM d, yyyy', { locale: srLatn })}
          </span>
        </>
      );
    } else if (view === 'agenda') {
      // Show the month range for agenda view
      const start = currentDate;
      const end = addDays(currentDate, AgendaDaysToShow - 1);

      if (isSameMonth(start, end)) {
        return format(start, 'MMMM yyyy', { locale: srLatn });
      } else {
        return `${format(start, 'MMM', { locale: srLatn })} - ${format(end, 'MMM yyyy', {
          locale: srLatn,
        })}`;
      }
    } else {
      return format(currentDate, 'MMMM yyyy', { locale: srLatn });
    }
  }, [currentDate, view]);

  return (
    <div
      className="flex flex-col rounded-lg has-data-[slot=month-view]:flex-1 md:border"
      style={
        {
          '--event-height': `${EventHeight}px`,
          '--event-gap': `${EventGap}px`,
          '--week-cells-height': `${WeekCellsHeight}px`,
        } as React.CSSProperties
      }
    >
      <div>
        {/* Header */}
        <div className={cn('flex items-center justify-between p-2 sm:p-4', className)}>
          <div className="flex items-center gap-1 sm:gap-4">
            <Button
              variant="outline"
              className="max-[479px]:aspect-square max-[479px]:p-0!"
              onClick={handleToday}
            >
              <CalendarCheckIcon className="min-[480px]:hidden" size={16} aria-hidden="true" />
              <span className="max-[479px]:sr-only">Danas</span>
            </Button>

            <div className="flex items-center sm:gap-2">
              <Button variant="ghost" size="icon" onClick={handlePrevious} aria-label="Previous">
                <ChevronLeftIcon size={16} aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNext} aria-label="Next">
                <ChevronRightIcon size={16} aria-hidden="true" />
              </Button>
            </div>

            <h2 className="sm:text-md text-sm font-semibold md:text-lg">{viewTitle}</h2>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1.5 max-[479px]:h-8">
                  <span>
                    <span className="min-[480px]:hidden" aria-hidden="true">
                      {getTextFromView(view).charAt(0)}
                    </span>
                    <span className="max-[479px]:sr-only">{getTextFromView(view)}</span>
                  </span>
                  <ChevronDownIcon className="-me-1 opacity-60" size={16} aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-32">
                <DropdownMenuItem onClick={() => setView('month')}>
                  Mesec <DropdownMenuShortcut>M</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setView('week')}>
                  Sedmica <DropdownMenuShortcut>S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setView('day')}>
                  Dan <DropdownMenuShortcut>D</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setView('agenda')}>
                  Agenda <DropdownMenuShortcut>A</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Prikaz kalendara u zavisnosti od izabranog view-a iz dropdown-a */}
        <div className="flex flex-1 flex-col">
          {view === 'month' && (
            <MonthView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
            />
          )}

          {view === 'week' && (
            <WeekView currentDate={currentDate} events={events} onEventSelect={handleEventSelect} />
          )}

          {view === 'day' && (
            <DayView currentDate={currentDate} events={events} onEventSelect={handleEventSelect} />
          )}

          {view === 'agenda' && (
            <AgendaView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
            />
          )}
        </div>

        <EventDialog
          event={selectedEvent}
          isOpen={isEventDialogOpen}
          onClose={() => {
            setIsEventDialogOpen(false);
            setSelectedEvent(null);
          }}
        />
      </div>
    </div>
  );
}
