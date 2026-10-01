import prisma from '@/lib/prisma';

export const getParticipations = async (volunteerId: string) => {
  const participations = await prisma.userActionParticipation.findMany({
    where: { userId: volunteerId },
    include: {
      action: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return participations;
};
