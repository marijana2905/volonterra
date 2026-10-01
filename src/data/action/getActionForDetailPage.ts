import prisma from '@/lib/prisma';

export const getActionForDetailPage = async (slug: string) => {
  const action = await prisma.action.findUnique({
    where: { slug },
    include: {
      categories: {
        select: {
          name: true,
          slug: true,
        },
      },
      organizer: {
        select: {
          organizationName: true,
          username: true,
          image: true,
        },
      },
      participations: {
        select: {
          type: true,
          status: true,
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
      },
      impressions: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
      },
    },
  });

  return action;
};
