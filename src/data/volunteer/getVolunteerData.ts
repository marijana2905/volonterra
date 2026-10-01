import prisma from '@/lib/prisma';

export const getVolunteerData = async (id: string) => {
  const volunteer = await prisma.volunteer.findUnique({
    where: { userId: id },
  });

  return volunteer;
};
