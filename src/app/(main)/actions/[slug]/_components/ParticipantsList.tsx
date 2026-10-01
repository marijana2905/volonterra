import AlertCard from '@/components/global/AlertCard';
import MyAvatar from '@/components/global/MyAvatar';
import { Card, CardContent } from '@/components/ui/card';
import { ParticipationListItem } from '@/types/participations.type';
import { ParticipationStatus } from '@prisma/types';
import { UsersIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

type Props = {
  participants: ParticipationListItem[];
};

const ParticipantsList = ({ participants }: Props) => {
  const filteredParticipants = participants.filter(
    (p) => p.status !== ParticipationStatus.CANCELLED,
  );

  if (filteredParticipants.length === 0) {
    return <AlertCard title="Nema prijavljenih učesnika za ovu akciju." />;
  }

  return (
    <div>
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <UsersIcon size={20} />
        Prijavljeni učesnici ({filteredParticipants.length})
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredParticipants.map((p) => (
          <Link href={`/volunteers/${p.user.username}`} key={p.user.username}>
            <Card className="group h-full">
              <CardContent className="flex items-center gap-4">
                <MyAvatar
                  imageUrl={p.user.image}
                  fallbackText={p.user.name.charAt(0).toUpperCase()}
                  className="h-10 w-10"
                />
                <div>
                  <span className="group-hover:text-primary text-sm font-medium transition-colors">
                    {p.user.name}
                  </span>
                  <span className="text-muted-foreground block text-xs">@{p.user.username}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ParticipantsList;
