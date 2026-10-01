import {
  ActionStatus,
  ParticipationStatus,
  ParticipationType,
  UserActionParticipation,
  UserRole,
} from '@prisma/types';

export type CalendarView = 'month' | 'week' | 'day' | 'agenda';

export interface CalendarEvent {
  role: UserRole; // role of the user (volunteer or organizer)

  id: string;
  title: string;
  slug: string;
  start: Date; // combine dateFrom and startTime from action model
  end: Date; // combine dateTo and endTime from action model
  allDay?: boolean; // ostaje samo da ne poremeti calendar prikaz (inace se racuna na osnovu start i end)
  color: EventColor; // na osnovu status-a akcije dodeli boje
  location: string; // combine city and address from action model
  minParticipants: number;
  maxParticipants: number;
  participants: number;

  status?: ActionStatus; // status akcije

  participationStatus?: ParticipationStatus; // status prijave (ako je volunteer)
  participationType?: ParticipationType; // tip prijave (ako je volunteer)
}

export type EventColor = 'sky' | 'amber' | 'violet' | 'rose' | 'emerald' | 'orange' | 'red';
