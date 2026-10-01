import prisma from '@/lib/prisma';

export const getOrganizerProfile = async (username: string) => {
  const organizer = await prisma.organizer.findUnique({
    where: { username },
    include: {
      actions: true,
    },
  });

  return organizer;
};
