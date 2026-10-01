import prisma from '@/lib/prisma';

export const getStatusForLandingPage = async () => {
  const [volunteers, organizers, cities, completedActions] = await Promise.all([
    prisma.volunteer.count(),
    prisma.organizer.count(),
    prisma.city.count(),
    prisma.action.count({ where: { status: 'COMPLETED' } }),
  ]);

  return {
    volunteers,
    organizers,
    cities,
    completedActions,
  };
};
