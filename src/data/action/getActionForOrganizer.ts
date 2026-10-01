import prisma from '@/lib/prisma';

export async function getActionsForOrganizer(userId: string) {
  const recentActionDb = await prisma.action.findFirst({
    where: {
      organizerUserId: userId,
      status: 'CREATED',
      fullDateTo: {
        gt: new Date(),
      },
    },
    orderBy: { fullDateFrom: 'asc' },
    include: { categories: true, organizer: true },
  });

  const mostParticipantsActionDb = await prisma.action.findFirst({
    where: {
      organizerUserId: userId,
      status: 'COMPLETED',
    },
    orderBy: { participants: 'desc' },
    include: { categories: true, organizer: true },
  });

  const mapAction = (action: typeof recentActionDb) => {
    if (!action) return undefined;

    return {
      ...action,
      fullDateFrom: action.fullDateFrom,
      fullDateTo: action.fullDateTo,
      categories: action.categories ?? [],
    };
  };

  return {
    recentAction: mapAction(recentActionDb),
    mostParticipantsAction: mapAction(mostParticipantsActionDb),
  };
}
