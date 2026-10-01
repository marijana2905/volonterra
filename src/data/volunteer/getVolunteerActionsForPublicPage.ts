import prisma from '@/lib/prisma';

export const getVolunteerActionsForPublicPage = async (volunteerId: string) => {
  const participations = await prisma.userActionParticipation.findMany({
    where: {
      userId: volunteerId,
    },
    select: {
      action: {
        include: {
          organizer: true,
          categories: true,
        },
      },
    },
  });

  return participations;
};
