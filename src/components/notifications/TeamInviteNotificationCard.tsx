import { NotificationStatus } from '@prisma/types';

import { Notification } from '@/types/notification.type';

import { formatRelativeTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckIcon, DotIcon, XIcon } from 'lucide-react';
import { BarLoader } from 'react-spinners';

type Props = {
  notification: Notification;
  onRespond: (invitationId: string, isAccepted: boolean, notificationId: string) => void;
  isLoading: boolean;
};

const TeamInviteNotificationCard = ({ notification, onRespond, isLoading }: Props) => {
  return (
    <div className="relative flex-col gap-1 border-b px-3 py-2 text-sm">
      <div className="flex items-start justify-between gap-2">
        <h1 className="font-semibold">{notification.title}</h1>
        {notification.status === NotificationStatus.UNREAD && <DotIcon />}
      </div>

      <span className="text-muted-foreground text-xs">{notification.message}</span>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-muted-foreground text-xs">
          {formatRelativeTime(new Date(notification.createdAt))}
        </span>

        {!notification.metadata?.isResponded ? (
          <div className="flex items-center gap-1">
            <Button
              variant={'outline'}
              size={'sm'}
              onClick={() => onRespond(notification.metadata!.invitationId, false, notification.id)}
              disabled={isLoading}
            >
              <XIcon />
              Odbij
            </Button>
            <Button
              variant={'default'}
              size={'sm'}
              onClick={() => onRespond(notification.metadata!.invitationId, true, notification.id)}
              disabled={isLoading}
            >
              <CheckIcon />
              Prihvati
            </Button>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">
            {notification.metadata?.isAccepted ? 'Prihvaćeno' : 'Odbijeno'}
          </span>
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full">
        <BarLoader color="green" width={'100%'} loading={isLoading} height={'2px'} />
      </div>
    </div>
  );
};

export default TeamInviteNotificationCard;
