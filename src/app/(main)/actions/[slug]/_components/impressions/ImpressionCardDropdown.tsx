'use client';

import { useState } from 'react';

import YesNoAlertDialog from '@/components/global/YesNoAlertDialog';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit2Icon, MoreVerticalIcon, Trash2Icon } from 'lucide-react';

import { toast } from 'sonner';
import { deleteImpression } from '@/actions/action/deleteImpression.action';
import CustomDialog from '@/components/global/CustomDialog';
import ImpressionForm from './ImpressionForm';
import { ActionImpressionType } from '@/types/action.type';

type ImpressionCardDropdownProps = {
  impression: ActionImpressionType;
};

const ImpressionCardDropdown = ({ impression }: ImpressionCardDropdownProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="cursor-pointer">
          <MoreVerticalIcon className="hover:text-primary" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setIsDropdownOpen(false);
              setIsEditOpen(true);
            }}
          >
            <Edit2Icon />
            Izmeni
          </DropdownMenuItem>

          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setIsDropdownOpen(false);
              setIsDeleteOpen(true);
            }}
          >
            <Trash2Icon />
            Obriši
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Alert Dialog */}
      <YesNoAlertDialog
        variant="error"
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Obriši utisak"
        description="Da li ste sigurni da želite da obrišete ovaj utisak? Ova akcija je nepovratna."
        confirmText="Da, obriši"
        cancelText="Odustani"
        loadingText="Brisanje"
        onConfirm={async () => {
          const { error } = await deleteImpression(impression.id);

          if (error) {
            toast.error(error);
            return;
          }

          toast.success('Utisak je uspešno obrisan.');
        }}
      />

      {/* Edit Dialog */}
      <CustomDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Izmeni utisak o akciji"
        description="Ažurirajte svoj utisak o akciji."
      >
        <ImpressionForm
          impression={impression}
          actionId={impression.actionId}
          onClose={() => setIsEditOpen(false)}
        />
      </CustomDialog>
    </>
  );
};

export default ImpressionCardDropdown;
