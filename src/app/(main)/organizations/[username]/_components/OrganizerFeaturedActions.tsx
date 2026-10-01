'use client';

import { ActionCard } from '@/components/hero/FeaturedActionsCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight as ArrowRightIcon, ClockIcon, UsersIcon } from 'lucide-react';
import { ActionWithOrganizerAndCategories } from '@/types/action.type';
import { Badge } from '@/components/ui/badge';

type OrganizersFeaturedActionsProps = {
  recentAction?: ActionWithOrganizerAndCategories;
  mostParticipantsAction?: ActionWithOrganizerAndCategories;
  organizerUsername: string;
};

//TODO: najlajkovanija akcija
const OrganizersFeaturedActions = ({
  recentAction,
  mostParticipantsAction,
  organizerUsername,
}: OrganizersFeaturedActionsProps) => {
  const hasActions = recentAction || mostParticipantsAction;

  if (!hasActions) {
    return (
      <div className="text-muted-foreground my-12 flex w-full items-center justify-center rounded-xl border p-12 text-center">
        Organizator još uvek nema akcije.
      </div>
    );
  }

  return (
    <section className="my-12 flex w-full flex-col items-center gap-8">
      <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {recentAction && (
          <div className="flex flex-col items-center text-center">
            <Badge className="mb-4">
              <ClockIcon />
              Nedavno održana
            </Badge>
            <ActionCard action={recentAction} showOrganizer={false} />
          </div>
        )}

        {mostParticipantsAction && (
          <div className="flex flex-col items-center text-center">
            <Badge className="mb-4">
              <UsersIcon /> Najviše učesnika
            </Badge>
            <ActionCard action={mostParticipantsAction} showOrganizer={false} />
          </div>
        )}
      </div>

      <Button variant="link" className="mt-8" asChild>
        <Link
          href={`/actions/?organizerUsername=${organizerUsername}`}
          className="flex items-center gap-2"
        >
          Pogledaj sve akcije <ArrowRightIcon />
        </Link>
      </Button>
    </section>
  );
};

export default OrganizersFeaturedActions;
