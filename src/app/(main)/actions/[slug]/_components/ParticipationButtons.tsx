'use client';

import { useState } from 'react';

import AlertCard from '@/components/global/AlertCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { useParticipation } from '@/hooks/useParticipation';
import { VscOrganization } from 'react-icons/vsc';
import CustomDialog from '@/components/global/CustomDialog';
import TeamParticipationForm from './TeamParticipationForm';

type Props = {
  actionId: string;
};

const ParticipationButtons = ({ actionId }: Props) => {
  const [isTeamParticipationModalOpen, setIsTeamParticipationModalOpen] = useState(false);

  const { isLoading, isParticipating, canParticipate, isSubmitting, session, participate } =
    useParticipation(actionId);

  if (isLoading) {
    return (
      <div className="flex w-full items-center">
        <Skeleton className="h-9 w-full" />
      </div>
    );
  }

  if (!session || session.data?.user.role !== 'VOLUNTEER') {
    return <AlertCard title="Samo registrovani volonteri se mogu prijaviti na akciju" />;
  }

  if (isParticipating) {
    return (
      <AlertCard
        title="Prijava evidentirana"
        description="Sve u vezi prijave možete pronaći u svom kontrolnom panelu."
      />
    );
  }

  return (
    <>
      <div className="flex items-center justify-center gap-2">
        <Button onClick={() => participate()} disabled={isSubmitting}>
          {isSubmitting ? 'Prijavljivanje...' : 'Prijavi me'}
        </Button>

        <Button onClick={() => setIsTeamParticipationModalOpen(true)} variant={'outline'}>
          <VscOrganization />
          Prijavi tim
        </Button>
      </div>

      <CustomDialog
        isOpen={isTeamParticipationModalOpen}
        setIsOpen={setIsTeamParticipationModalOpen}
        title="Prijava tima"
        description="Izaberite jedan od timova koji želite da prijavite na akciju"
      >
        <TeamParticipationForm actionId={actionId} setIsOpen={setIsTeamParticipationModalOpen} />
      </CustomDialog>
    </>
  );
};

export default ParticipationButtons;
