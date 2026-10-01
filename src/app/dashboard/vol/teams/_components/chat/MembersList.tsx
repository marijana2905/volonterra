'use client';

import { Button } from '@/components/ui/button';
import { TeamWithMembers } from '@/types/team.type';

type Props = {
  team: TeamWithMembers;
};

const MembersList = ({ team }: Props) => {
  const members = team.members || [];
  const visible = members.slice(0, 3);
  const remaining = members.length - visible.length;

  if (members.length === 0) {
    return null; // Nema članova za prikaz
  }

  return (
    <div className="flex -space-x-3">
      {visible.map(m => (
        <img
          key={m.user.id}
          className="ring-background rounded-full object-cover ring-2"
          src={m.user.image ?? '/default_avatar.svg'}
          width={32}
          height={32}
          alt={m.user.username ?? m.user.name}
          title={m.user.username ?? m.user.name}
        />
      ))}
      {remaining > 0 && (
        <Button
          variant="secondary"
          className="bg-secondary text-muted-foreground ring-background hover:bg-secondary hover:text-foreground flex size-10 items-center justify-center rounded-full text-xs ring-2"
          size="icon"
        >
          +{remaining}
        </Button>
      )}
    </div>
  );
};

export default MembersList;
