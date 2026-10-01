import prisma from '@/lib/prisma';

export const getVolunteersInfo = async (username: string) => {
  const volunteer = await prisma.volunteer.findUnique({
    where: { username },
  });

  return volunteer;
};
