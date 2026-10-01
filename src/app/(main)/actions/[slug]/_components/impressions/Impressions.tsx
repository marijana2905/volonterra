import React from 'react';

import { getUserSession } from '@/data/auth/getUserSession';

import { MessageSquareTextIcon } from 'lucide-react';

import AlertCard from '@/components/global/AlertCard';
import ImpressionCard from './ImpressionCard';
import { ActionImpressionType } from '@/types/action.type';
import ImpressionFormTrigger from './ImpressionFormTrigger';

type Props = {
  impressions: ActionImpressionType[];
  participantsIds: (string | undefined)[];
  actionId: string;
};

const Impressions = async ({ impressions, participantsIds, actionId }: Props) => {
  const session = await getUserSession();

  // Volunteer can leave impression only if:
  // - is logged in
  // - has VOLUNTEER role
  // - participated in the action (ATTENDED)
  // - has not left an impression yet
  const userCanLeaveImpression =
    session &&
    session.user.role === 'VOLUNTEER' &&
    participantsIds?.includes(session.user.id) &&
    !impressions.some(imp => imp.userId === session.user.id);

  return (
    <div>
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <MessageSquareTextIcon size={20} /> Utisci ({impressions.length})
      </h2>

      {userCanLeaveImpression && <ImpressionFormTrigger actionId={actionId} />}

      <div className="mt-4 flex flex-col gap-4">
        {impressions.length === 0 ? (
          <AlertCard title="Još uvek nema utisaka za ovu akciju." />
        ) : (
          impressions.map(impression => (
            <ImpressionCard
              key={impression.id}
              impression={impression}
              canUserEdit={session?.user.id === impression.userId}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Impressions;
