import prisma from '@/lib/prisma';

export async function getTopOrganizations(limit = 7) {
  const organizers = await prisma.organizer.findMany({
    take: limit,
    where: {
      user: {
        username: {
          not: null,
        },
      },
    },
    orderBy: {
      actions: {
        _count: 'desc',
      },
    },
    select: {
      organizationName: true,
      user: {
        select: {
          username: true,
        },
      },
    },
  });

  if (organizers.length === 0) {
    throw new Error('Nema organizatora sa validnim username-om');
  }

  return organizers;
}
