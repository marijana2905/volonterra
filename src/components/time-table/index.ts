'use client';

// Component exports
export { AgendaView } from './views/AgendaView';
export { DayView } from './views/DayView';
export { DraggableEvent } from './DraggableEvent';
export { EventDialog } from './EventDialog';
export { EventItem } from './EventItem';
export { EventsPopup } from './EventsPopup';
export { EventCalendar } from './EventCalendar';
export { MonthView } from './views/MonthView';
export { WeekView } from './views/WeekView';

// Constants and utility exports
export * from './constants';
export * from './utils';

// Hook exports
export * from './useCurrentTimeIndicator';
export * from './UseEventVisibility';

// Type exports
export type { CalendarEvent, CalendarView, EventColor } from './types';
