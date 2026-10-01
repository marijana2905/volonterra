import { requireOrganizer } from '@/data/auth/requireOrganizer';
import prisma from '@/lib/prisma';

export const getActionForEdit = async (slug: string) => {
  await requireOrganizer();

  const action = await prisma.action.findUnique({
    where: { slug },
    include: {
      categories: {
        select: {
          id: true,
        },
      },
    },
  });

  return action;
};
