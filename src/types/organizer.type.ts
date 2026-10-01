import { Organizer, Action } from '@prisma/types';

export type OrganizerListItem = {
  userId: string;
  organizationName: string;
  username: string;
  image: string | null;
  likesCount: number;
  likes:
    | {
        userId: string;
      }[]
    | null;
};

export type OrganizerProfile = Organizer & {
  actions: Action[];
};
