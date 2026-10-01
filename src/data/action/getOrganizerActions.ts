import { requireOrganizer } from '@/data/auth/requireOrganizer';
import { ActionDashboardSelect, ActionStatusExtended } from '@/types/action.type';
import prisma from '@/lib/prisma';
import { ActionStatus } from '@prisma/types';

export const getOrganizerActions = async (id: string, filter: ActionStatusExtended) => {
  await requireOrganizer();

  let whereClause = {};

  switch (filter) {
    case 'UPCOMING':
      whereClause = {
        fullDateFrom: {
          gt: new Date(),
        },
        status: {
          not: ActionStatus.CANCELLED,
        },
      };
      break;
    case 'ONGOING':
      whereClause = {
        fullDateFrom: {
          lte: new Date(),
        },
        fullDateTo: {
          gte: new Date(),
        },
      };
      break;
    case 'CANCELLED':
      whereClause = {
        status: ActionStatus.CANCELLED,
      };
      break;
    case 'COMPLETED':
      whereClause = {
        status: ActionStatus.COMPLETED,
      };
      break;
    case 'APPROVAL_NEEDED':
      whereClause = {
        fullDateTo: {
          lt: new Date(),
        },
        status: {
          notIn: [ActionStatus.COMPLETED, ActionStatus.CANCELLED],
        },
      };
      break;
    default:
      // For 'ALL' or any other filter, no specific where clause is needed
      break;
  }

  const actions = await prisma.action.findMany({
    where: {
      organizerUserId: id,
      ...whereClause,
    },
    orderBy: { createdAt: 'desc' },
    select: ActionDashboardSelect,
  });

  return actions;
};
