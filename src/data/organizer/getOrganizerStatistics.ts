import prisma from '@/lib/prisma';
import { ActionStatus } from '@prisma/types';
import { requireOrganizer } from '../auth/requireOrganizer';

export type OrganizerStatistics = {
  questionsCount: number;
  answeredQuestionsCount: number;
  unansweredQuestionsCount: number;
  uniqueVolunteersCount: number;
  createdActionsCount: number;
  cancelledActionsCount: number;
  completedActionsCount: number;
  actionsNeedingConfirmationCount: number; // legacy alias for approvalNeededActionsCount
  // Extended live statuses based on time windows
  upcomingActionsCount: number;
  ongoingActionsCount: number;
  approvalNeededActionsCount: number;
};

export const getOrganizerStatistics = async (): Promise<OrganizerStatistics> => {
  const session = await requireOrganizer();
  const now = new Date();

  // 1) Count questions for the organizer
  const questionsCount = await prisma.question.count({
    where: { organizerUserId: session.user.id },
  });

  // 2) Count unique volunteers that participated in any action of this organizer
  const distinctVolunteers = await prisma.userActionParticipation.findMany({
    where: {
      action: {
        organizerUserId: session.user.id,
      },
    },
    select: { userId: true },
    distinct: ['userId'],
  });

  const uniqueVolunteersCount = distinctVolunteers.length;

  // 3) Count actions by status for this organizer and questions answered/unanswered
  const [
    createdActionsCount,
    cancelledActionsCount,
    completedActionsCount,
    upcomingActionsCount,
    ongoingActionsCount,
    approvalNeededActionsCount,
    answeredQuestionsCount,
    unansweredQuestionsCount,
  ] = await Promise.all([
    // Raw status counts
    prisma.action.count({
      where: { organizerUserId: session.user.id, status: ActionStatus.CREATED },
    }),
    prisma.action.count({
      where: { organizerUserId: session.user.id, status: ActionStatus.CANCELLED },
    }),
    prisma.action.count({
      where: { organizerUserId: session.user.id, status: ActionStatus.COMPLETED },
    }),
    // UPCOMING: status CREATED and starts in the future
    prisma.action.count({
      where: {
        organizerUserId: session.user.id,
        status: ActionStatus.CREATED,
        fullDateFrom: { gt: now },
      },
    }),
    // ONGOING: status CREATED and now between [from, to]
    prisma.action.count({
      where: {
        organizerUserId: session.user.id,
        status: ActionStatus.CREATED,
        fullDateFrom: { lte: now },
        fullDateTo: { gte: now },
      },
    }),
    // APPROVAL_NEEDED: ended but not completed/cancelled (i.e., still CREATED and passed end time)
    prisma.action.count({
      where: {
        organizerUserId: session.user.id,
        status: ActionStatus.CREATED,
        fullDateTo: { lt: now },
      },
    }),
    // answered = has at least one message with a senderUserId
    prisma.question.count({
      where: {
        organizerUserId: session.user.id,
        messages: { some: { senderUserId: { not: null } } },
      },
    }),
    // unanswered = has no messages
    prisma.question.count({
      where: { organizerUserId: session.user.id, messages: { none: {} } },
    }),
  ]);

  const actionsNeedingConfirmationCount = approvalNeededActionsCount;

  return {
    questionsCount,
    answeredQuestionsCount,
    unansweredQuestionsCount,
    uniqueVolunteersCount,
    createdActionsCount,
    cancelledActionsCount,
    completedActionsCount,
    actionsNeedingConfirmationCount,
    upcomingActionsCount,
    ongoingActionsCount,
    approvalNeededActionsCount,
  };
};
