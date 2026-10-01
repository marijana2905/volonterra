'use client';

import { MoreVerticalIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { cancelIParticipation } from '@/actions/participation/cancelParticipation';
import { VolunteerParticipation } from '@/types/participations.type';
import { useState } from 'react';
import YesNoAlertDialog from '@/components/global/YesNoAlertDialog';

interface ParticipationActionsProps {
  participation: VolunteerParticipation;
}

const ParticipationActions = ({ participation }: ParticipationActionsProps) => {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  const handleCancelParticipation = async () => {
    const { error } = await cancelIParticipation(participation.action.id, participation.userId);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success('Prijava uspešno otkazana');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVerticalIcon size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem variant="destructive" onClick={() => setIsCancelDialogOpen(true)}>
            <XIcon />
            Otkaži prijavu
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <YesNoAlertDialog
        variant="error"
        title="Otkaži prijavu"
        description="Otkazivanjem prijave gubite pravo učešća na akciji. Za povratak prijave morate kontaktirati organizatora. Da li ste sigurni da želite da otkažete prijavu?"
        isOpen={isCancelDialogOpen}
        setIsOpen={setIsCancelDialogOpen}
        onConfirm={handleCancelParticipation}
        confirmText="Otkaži prijavu"
        cancelText="Odustani"
        loadingText="Otkazivanje..."
      />
    </>
  );
};

export default ParticipationActions;
