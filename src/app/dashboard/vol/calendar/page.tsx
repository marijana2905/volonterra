import { ParticipationStatus } from '@prisma/types';
import { requireVolunteer } from '@/data/auth/requireVolunteer';
import { getVolunteerActionsForCalendar } from '@/data/action/getVolunteerActionsForCalendar';
import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import { CalendarEvent, EventCalendar, EventColor } from '@/components/time-table';
import ColorLegendVolunteer from './_components/ColorLegendVolunteer';

export const metadata = {
  title: 'Kalendar',
};

const VolunteerCalendarPage = async () => {
  const session = await requireVolunteer();
  const events = await getVolunteerActionsForCalendar(session.user.id);

  const getEventColor = (status: ParticipationStatus): EventColor => {
    switch (status) {
      case 'ATTENDED':
        return 'emerald';
      case 'APPLIED':
        return 'violet';
      case 'CANCELLED':
        return 'red';
      default:
        return 'amber'; // Default color for other statuses
    }
  };

  // Mapiramo event-e u format koji koristi EventCalendar
  const calendarEvents: CalendarEvent[] = events.map((event) => ({
    role: 'VOLUNTEER',
    id: event.action.id,
    title: event.action.title,
    slug: event.action.slug,
    start: event.action.fullDateFrom,
    end: event.action.fullDateTo,
    color: getEventColor(event.status),
    location: `${event.action.city}${event.action.address ? `, ${event.action.address}` : ''}`,
    minParticipants: event.action.minParticipants,
    maxParticipants: event.action.maxParticipants,
    participants: event.action.participants,
    participationStatus: event.status,
    participationType: event.type,
  }));

  return (
    <>
      <section className="flex flex-col gap-4 p-4">
        <BreadcrumbWrapper items={[{ label: 'Kalendar' }]} homeHref="/dashboard/vol/statistics" />
        <div className="flex flex-col gap-4 md:px-8">
          <EventCalendar events={calendarEvents} />
          <ColorLegendVolunteer />
        </div>
      </section>
    </>
  );
};

export default VolunteerCalendarPage;
