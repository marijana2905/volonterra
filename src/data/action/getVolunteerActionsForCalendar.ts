import prisma from '@/lib/prisma';
import { requireVolunteer } from '../auth/requireVolunteer';

export const getVolunteerActionsForCalendar = async (id: string) => {
  await requireVolunteer();

  const calendarEvents = await prisma.userActionParticipation.findMany({
    where: { userId: id },
    orderBy: { action: { createdAt: 'desc' } },
    select: {
      type: true,
      status: true,
      action: {
        select: {
          id: true,
          title: true,
          slug: true,
          startTime: true,
          endTime: true,
          fullDateFrom: true,
          fullDateTo: true,
          minParticipants: true,
          maxParticipants: true,
          participants: true,
          city: true,
          address: true,
        },
      },
    },
  });

  // Kasnije ovde pribavi i whishlist-u i spoji sve u jednu veliku listu kojoj ces da dodas tip ('whishlist' ili 'participation')

  return calendarEvents;
};
