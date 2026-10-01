import prisma from '@/lib/prisma';
import { ParticipationStatus } from '@prisma/types';
import { requireVolunteer } from '../auth/requireVolunteer';

type MonthlyCounts = {
  applied: number;
  attended: number;
  cancelled: number;
};

export type ActionsPerMonthResult = {
  date: string;
  applied: number;
  attended: number;
  cancelled: number;
};

export const getActionsPerMonth = async (): Promise<ActionsPerMonthResult[]> => {
  const session = await requireVolunteer();
  const userId = session.user.id;

  const now = new Date();
  const currentUTCYear = now.getUTCFullYear();
  const currentUTCMonth = now.getUTCMonth();
  const startOfCurrentMonth = new Date(Date.UTC(currentUTCYear, currentUTCMonth, 1));
  const startDate = new Date(startOfCurrentMonth);
  startDate.setUTCMonth(startDate.getUTCMonth() - 11);
  const startYear = startDate.getUTCFullYear();
  const startMonth = startDate.getUTCMonth();
  const endDate = new Date(Date.UTC(currentUTCYear, currentUTCMonth + 1, 1));

  const participations = await prisma.userActionParticipation.findMany({
    where: {
      userId,
      status: {
        in: [
          ParticipationStatus.APPLIED,
          ParticipationStatus.ATTENDED,
          ParticipationStatus.CANCELLED,
        ],
      },
      action: {
        fullDateFrom: {
          gte: startDate,
          lt: endDate,
        },
      },
    },
    select: {
      status: true,
      action: {
        select: {
          fullDateFrom: true,
        },
      },
    },
  });

  const monthlyCounts = new Map<string, MonthlyCounts>();

  participations.forEach(({ status, action }) => {
    const monthKey = action.fullDateFrom.toISOString().slice(0, 7);
    const currentCounts = monthlyCounts.get(monthKey) ?? { applied: 0, attended: 0, cancelled: 0 };

    if (status === ParticipationStatus.APPLIED) {
      currentCounts.applied += 1;
    } else if (status === ParticipationStatus.ATTENDED) {
      currentCounts.attended += 1;
    } else if (status === ParticipationStatus.CANCELLED) {
      currentCounts.cancelled += 1;
    }

    monthlyCounts.set(monthKey, currentCounts);
  });

  return Array.from({ length: 12 }).map((_, index) => {
    const monthStart = new Date(Date.UTC(startYear, startMonth + index, 1));
    const monthKey = monthStart.toISOString().slice(0, 7);
    const counts = monthlyCounts.get(monthKey) ?? { applied: 0, attended: 0, cancelled: 0 };

    return {
      date: monthStart.toISOString(),
      applied: counts.applied,
      attended: counts.attended,
      cancelled: counts.cancelled,
    };
  });
};
