'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ActionDashboard } from '@/types/action.type';

import YesNoAlertDialog from '@/components/global/YesNoAlertDialog';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Edit3Icon,
  MoreVerticalIcon,
  Trash2Icon,
  XIcon,
  CheckIcon,
  UsersIcon,
  ImagesIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { deleteAction } from '@/actions/action/deleteAction.action';
import { canEditAction } from '@/lib/utils';
import CustomDialog from '@/components/global/CustomDialog';
import CancelActionForm from './CancelActionForm';

type Props = {
  action: ActionDashboard;
  isApprovalNeeded: boolean;
};

const ActionDropdown = ({ action, isApprovalNeeded }: Props) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const canEditOrCancelAction = canEditAction(action.fullDateFrom, action.status);

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="cursor-pointer">
          <MoreVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isApprovalNeeded ? (
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/org/actions/${action.slug}/participations`}
                className="cursor-pointer"
              >
                <CheckIcon />
                Potvrdi
              </Link>
            </DropdownMenuItem>
          ) : (
            <>
              {canEditOrCancelAction && (
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/org/actions/${action.slug}`} className="cursor-pointer">
                    <Edit3Icon />
                    Izmeni
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/org/actions/${action.slug}/participations`}
                  className="cursor-pointer"
                >
                  <UsersIcon />
                  Vidi prijave
                </Link>
              </DropdownMenuItem>

              {/* {action.status === 'COMPLETED' && (
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/org/actions/${action.slug}/gallery`}
                    className="cursor-pointer"
                  >
                    <ImagesIcon />
                    Galerija
                  </Link>
                </DropdownMenuItem>
              )} */}

              {/* Otkazivanje je moguce samo dva dana pre akcije (isto kao i izmena) */}
              {canEditOrCancelAction && (
                <DropdownMenuItem
                  variant="default"
                  onClick={() => {
                    setIsCancelOpen(true);
                    setIsDropdownOpen(false);
                  }}
                >
                  <XIcon />
                  Otkaži
                </DropdownMenuItem>
              )}

              {/* Delete je moguc samo ako je broj prijavljenih 0 */}
              {action.participants === 0 && (
                <>
                  <DropdownMenuSeparator />

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
                </>
              )}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Alert Dialog */}
      <YesNoAlertDialog
        variant="error"
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title="Brisanje akcije?"
        description={`Da li ste sigurni da želite da obrišete akciju "${action.title}"? Ova radnja se ne može poništiti.`}
        confirmText="Da, obriši"
        cancelText="Ne, odustani"
        onConfirm={async () => {
          const { error } = await deleteAction(action.id);

          if (error) {
            toast.error(error);
            return;
          }

          toast.success(`Akcija "${action.title}" je uspešno obrisana.`);
        }}
      />

      {/* Cancel Alert Dialog */}
      <CustomDialog
        isOpen={isCancelOpen}
        setIsOpen={setIsCancelOpen}
        title="Otkaži akciju"
        description={`Da li želite da otkažete "${action.title}"? Prijavljeni volonteri će biti obavešteni.`}
      >
        <CancelActionForm actionId={action.id} onClose={() => setIsCancelOpen(false)} />
      </CustomDialog>
    </>
  );
};

export default ActionDropdown;
