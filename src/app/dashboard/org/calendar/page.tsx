import { requireOrganizer } from '@/data/auth/requireOrganizer';
import { getOrganizerActionsForCalendar } from '@/data/action/getOrganizerActionsForCalendar';

import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import { CalendarEvent, EventCalendar, EventColor } from '@/components/time-table';
import { ActionStatus } from '@prisma/types';
import ColorLegend from './_components/ColorLegend';
import { isApprovalNeeded, isCurrentlyActiveAction } from '@/lib/utils';

export const metadata = {
  title: 'Kalendar',
};

const OrganizerCalendarPage = async () => {
  const session = await requireOrganizer();
  const actions = await getOrganizerActionsForCalendar(session.user.id);

  const getEventColor = (
    status: ActionStatus,
    fullDateFrom: Date,
    fullDateTo: Date,
  ): EventColor => {
    const approveNeed = isApprovalNeeded(fullDateTo, status);
    const currentlyActive = isCurrentlyActiveAction(fullDateFrom, fullDateTo, status);

    // Ako su u toku onda sky boja
    if (currentlyActive) {
      return 'emerald';
    }

    // Ako je potrebno odobrenje onda violet
    if (approveNeed) {
      return 'violet';
    }

    switch (status) {
      case 'CREATED':
        return 'amber';
      case 'COMPLETED':
        return 'sky';
      case 'CANCELLED':
        return 'red';
      default:
        return 'orange';
    }
  };

  // Mapiramo akcije u format koji koristi EventCalendar
  const calendarEvents: CalendarEvent[] = actions.map((action) => ({
    role: 'ORGANIZER',
    id: action.id,
    title: action.title,
    slug: action.slug,
    start: action.fullDateFrom,
    end: action.fullDateTo,
    color: getEventColor(action.status, action.fullDateFrom, action.fullDateTo),
    location: `${action.city}${action.address ? `, ${action.address}` : ''}`,
    minParticipants: action.minParticipants,
    maxParticipants: action.maxParticipants,
    participants: action.participants,
    status: action.status,
  }));

  return (
    <>
      <section className="flex flex-col gap-4 p-4">
        <BreadcrumbWrapper items={[{ label: 'Kalendar' }]} homeHref="/dashboard/org/statistics" />
        <div className="flex flex-col gap-4 md:px-8">
          <EventCalendar events={calendarEvents} />
          <ColorLegend />
        </div>
      </section>
    </>
  );
};

export default OrganizerCalendarPage;
