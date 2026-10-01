import prisma from '@/lib/prisma';
import { requireVolunteer } from '../auth/requireVolunteer';

export type VolunteerStatistics = {
  interestZoneCount: number;
  createdTeamsCount: number;
  teamMembershipsCount: number;
  postsCount: number;
  questionsCount: number;
  participationsCount: number;
};

export const getVolunteerStatistics = async (): Promise<VolunteerStatistics> => {
  const session = await requireVolunteer();
  const userId = session.user.id;

  const [
    interestZoneCount,
    createdTeamsCount,
    teamMembershipsCount,
    postsCount,
    questionsCount,
    participationsCount,
  ] = await Promise.all([
    prisma.interestZone.count({ where: { userId } }),
    prisma.team.count({ where: { creatorId: userId } }),
    prisma.teamMember.count({ where: { userId } }),
    prisma.post.count({ where: { authorId: userId } }),
    prisma.question.count({ where: { userId } }),
    prisma.userActionParticipation.count({ where: { userId } }),
  ]);

  return {
    interestZoneCount,
    createdTeamsCount,
    teamMembershipsCount,
    postsCount,
    questionsCount,
    participationsCount,
  };
};
