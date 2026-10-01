import {
  Action,
  ParticipationStatus,
  ParticipationType,
  UserActionParticipation,
} from '@prisma/types';

export type ParticipationListItem = {
  user: {
    name: string;
    image?: string | null;
    username: string | null;
  };
  type: ParticipationType;
  status: ParticipationStatus;
};

export type VolunteerParticipation = {
  createdAt: Date;
  updatedAt: Date;
  type: ParticipationType;
  status: ParticipationStatus;
  userId: string;
  actionId: string;
  teamId: string | null;
  isUserTeamCreator: boolean | null;
  action: {
    id: string;
    title: string;
    slug: string;
    city: string;
    address: string;
    fullDateFrom: Date;
    fullDateTo: Date;
  };
};

export type VolunteerParticipationForProfile = UserActionParticipation & {
  action: Action;
};
