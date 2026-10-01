import prisma from '@/lib/prisma';

export async function getRecentActions() {
  try {
    const actions = await prisma.action.findMany({
      take: 7,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    return actions;
  } catch (error) {
    console.error('Error fetching recent actions:', error);
    return [];
  }
}

export default getRecentActions;
