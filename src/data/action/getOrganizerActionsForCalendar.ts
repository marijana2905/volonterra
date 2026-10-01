import { requireOrganizer } from '@/data/auth/requireOrganizer';
import { ActionCalendarSelect } from '@/types/action.type';
import prisma from '@/lib/prisma';

export const getOrganizerActionsForCalendar = async (id: string) => {
  await requireOrganizer();

  const actions = await prisma.action.findMany({
    where: { organizerUserId: id },
    orderBy: { createdAt: 'desc' },
    select: ActionCalendarSelect,
  });

  return actions;
};
