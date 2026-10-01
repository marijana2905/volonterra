'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { MailCheckIcon, MoreVerticalIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import YesNoAlertDialog from '@/components/global/YesNoAlertDialog';
import { deleteNotificationAction } from '@/actions/notifications/deleteNotification.action';
import { markAsReadNotification } from '@/actions/notifications/markNotificationAsRead.action';
import { Notification } from '@/types/notification.type';
import { NotificationStatus } from '@prisma/types';

type Props = {
  notification: Notification;
};

const NotificationDropdown = ({ notification }: Props) => {
  const queryClient = useQueryClient();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleMarkAsRead = async () => {
    const { error } = await markAsReadNotification(notification.id);

    if (error) {
      toast.error(error);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['notifications'] });
    toast.success('Notifikacija je označena kao pročitana.');
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="cursor-pointer">
          <MoreVerticalIcon className="hover:text-primary" size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {notification.status === NotificationStatus.UNREAD && (
            <DropdownMenuItem onClick={handleMarkAsRead} className="group">
              <MailCheckIcon className="group-hover:text-primary" />
              Označi kao pročitano
            </DropdownMenuItem>
          )}

          <DropdownMenuItem variant="destructive" onClick={() => setIsDeleteOpen(true)}>
            <Trash2Icon />
            Obriši
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <YesNoAlertDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        variant="error"
        title="Brisanje notifikacije"
        description="Da li ste sigurni da želite da obrišete ovu notifikaciju?"
        confirmText="Da, obriši"
        cancelText="Odustani"
        onConfirm={async () => {
          const { error } = await deleteNotificationAction(notification.id);

          if (error) {
            toast.error(error);
            return;
          }

          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          toast.success('Notifikacija je uspešno obrisana.');
        }}
      />
    </>
  );
};

export default NotificationDropdown;
