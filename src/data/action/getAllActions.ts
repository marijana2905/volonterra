import prisma from '@/lib/prisma';

export async function getAllActions() {
  const actions = await prisma.action.findMany({
    orderBy: { fullDateFrom: 'asc' },
    include: {
      categories: true,
      organizer: {
        select: { organizationName: true, image: true, username: true },
      },
    },
  });

  return actions;
}

export default getAllActions;
