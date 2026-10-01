import prisma from '@/lib/prisma';

export const getOrganizerData = async (id: string) => {
  const organizer = await prisma.organizer.findUnique({
    where: { userId: id },
  });

  return organizer;
};
