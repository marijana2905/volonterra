import prisma from '@/lib/prisma';

export const getVolunteerParticipations = async (id: string) => {
  const participations = await prisma.userActionParticipation.findMany({
    where: { userId: id },
    include: {
      action: true,
    },
  });

  return participations;
};
