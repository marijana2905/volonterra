import prisma from '@/lib/prisma';

// TODO: razmisli o paginaciji
export const getOrganizers = async (take?: number) => {
  const organizers = await prisma.organizer.findMany({
    orderBy: {
      likesCount: 'desc',
    },
    select: {
      userId: true,
      organizationName: true,
      username: true,
      image: true,
      likesCount: true,
      likes: {
        select: {
          userId: true,
        },
      },
    },

    ...(typeof take === 'number' ? { take } : {}),
  });

  return organizers;
};
