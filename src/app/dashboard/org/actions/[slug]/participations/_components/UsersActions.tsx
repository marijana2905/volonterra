'use client';

import { useState } from 'react';

import { UserParticipation } from '@/types/action.type';
import { organizerCancelIndividualParticipation } from '@/actions/participation/organizerCancelIndividualParticipation';

import YesNoAlertDialog from '@/components/global/YesNoAlertDialog';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { FileUserIcon, MoreVerticalIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { applyAgain } from '@/actions/participation/applyAgain';

type Props = {
  actionId: string;
  participation: UserParticipation;
};

const UsersActions = ({ actionId, participation }: Props) => {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isApplyAgainDialogOpen, setIsApplyAgainDialogOpen] = useState(false);

  const handleCancelParticipation = async () => {
    const { error } = await organizerCancelIndividualParticipation(actionId, participation.user.id);

    if (error) {
      toast.error(error);
      return;
    } else {
      toast.success('Volonterova prijava je uspešno otkazana.');
    }
  };

  const handleApplyAgain = async () => {
    const { error } = await applyAgain(actionId, participation.user.id);

    if (error) {
      toast.error(error);
      return;
    } else {
      toast.success('Volonter je ponovo prijavljen.');
    }
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
          {participation.status === 'APPLIED' && (
            <DropdownMenuItem variant="destructive" onClick={() => setIsCancelDialogOpen(true)}>
              <XIcon />
              Otkaži volontera
            </DropdownMenuItem>
          )}
          {participation.status === 'CANCELLED' && (
            <DropdownMenuItem onClick={() => setIsApplyAgainDialogOpen(true)}>
              <FileUserIcon />
              Ponovo prijavi
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <YesNoAlertDialog
        variant="error"
        title="Otkaži volontera"
        description="Volonter će dobiti obaveštenje o otkazivanju prijave. Da li ste sigurni da želite da otkažete prijavu?"
        isOpen={isCancelDialogOpen}
        setIsOpen={setIsCancelDialogOpen}
        onConfirm={handleCancelParticipation}
        confirmText="Da, otkaži"
        cancelText="Odustani"
        loadingText="Otkazivanje..."
      />

      <YesNoAlertDialog
        variant="default"
        title="Ponovo prijavi volontera"
        description="Da li ste sigurni da želite da ponovo prijavite volontera?"
        isOpen={isApplyAgainDialogOpen}
        setIsOpen={setIsApplyAgainDialogOpen}
        onConfirm={handleApplyAgain}
        confirmText="Da, ponovo prijavi"
        cancelText="Odustani"
      />
    </>
  );
};

export default UsersActions;
