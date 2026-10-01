import { unstable_noStore as noStore } from 'next/cache';
import prisma from '@/lib/prisma';
import { ActionStatus } from '@prisma/types';

export async function getActionsForLandingPage() {
  noStore();
  const actions = await prisma.action.findMany({
    where: { status: ActionStatus.CREATED },
    orderBy: { fullDateFrom: 'desc' },
    take: 3,
    include: {
      categories: true,
      organizer: true,
    },
  });

  return actions;
}
