import prisma from '@/lib/prisma';
import { ActionStatus } from '@prisma/types';
import { requireAdmin } from '../auth/requireAdmin';

export type AllActionsStatistics = {
  createdActionsCount: number;
  cancelledActionsCount: number;
  completedActionsCount: number;
  upcomingActionsCount: number;
  ongoingActionsCount: number;
  approvalNeededActionsCount: number;
};

export const getAllActionsStatistics = async (): Promise<AllActionsStatistics> => {
  await requireAdmin();

  const now = new Date();

  const [
    createdActionsCount,
    cancelledActionsCount,
    completedActionsCount,
    upcomingActionsCount,
    ongoingActionsCount,
    approvalNeededActionsCount,
  ] = await Promise.all([
    // CREATED
    prisma.action.count({ where: { status: ActionStatus.CREATED } }),
    // CANCELLED
    prisma.action.count({ where: { status: ActionStatus.CANCELLED } }),
    // COMPLETED
    prisma.action.count({ where: { status: ActionStatus.COMPLETED } }),
    // UPCOMING: status CREATED and starts in the future
    prisma.action.count({
      where: { status: ActionStatus.CREATED, fullDateFrom: { gt: now } },
    }),
    // ONGOING: status CREATED and now between [from, to]
    prisma.action.count({
      where: {
        status: ActionStatus.CREATED,
        fullDateFrom: { lte: now },
        fullDateTo: { gte: now },
      },
    }),
    // APPROVAL_NEEDED: ended but not completed/cancelled (still CREATED and passed end time)
    prisma.action.count({
      where: { status: ActionStatus.CREATED, fullDateTo: { lt: now } },
    }),
  ]);

  return {
    createdActionsCount,
    cancelledActionsCount,
    completedActionsCount,
    upcomingActionsCount,
    ongoingActionsCount,
    approvalNeededActionsCount,
  };
};
