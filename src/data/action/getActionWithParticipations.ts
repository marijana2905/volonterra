import prisma from '@/lib/prisma';
import { requireOrganizer } from '../auth/requireOrganizer';

export const getActionWithParticipations = async (slug: string) => {
  await requireOrganizer();

  const action = await prisma.action.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      city: true,
      address: true,
      fullDateFrom: true,
      fullDateTo: true,
      minParticipants: true,
      maxParticipants: true,
      participants: true,
      status: true,
      participations: {
        select: {
          status: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
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
