type User = {
  name: string;
  id: string;
  image: string | null;
  username: string | null;
};

type TeamMember = {
  user: User;
};

export type TeamWithMembers = {
  name: string;
  id: string;
  creatorId: string;
  image: string | null;
  bio: string | null;
  members: TeamMember[];
};
