import { useState } from 'react';
import { IsRestoringProvider, useQueryClient } from '@tanstack/react-query';
import {
  ArrowRightIcon,
  CheckCheckIcon,
  CheckIcon,
  ClockIcon,
  DotIcon,
  Loader2Icon,
  XIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { respondToInvitationAction } from '@/actions/team/respondToInvitation.action';
import ButtonLink from '@/components/global/ButtonLink';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatRelativeTime } from '@/lib/utils';
import { Notification } from '@/types/notification.type';
import { NotificationStatus, NotificationType } from '@prisma/types';

import NotificationDropdown from './NotificationDropdown';
import { BarLoader } from 'react-spinners';

type NotificationCardProps = {
  notification: Notification;
};

const NotificationCard = ({ notification }: NotificationCardProps) => {
  const [isResponding, setIsResponding] = useState(false);
  const queryClient = useQueryClient();

  const handleRespondToInvitation = async (
    invitationId: string,
    isAccepted: boolean,
    notificationId: string,
  ) => {
    setIsResponding(true);

    const { error } = await respondToInvitationAction(invitationId, isAccepted, notificationId);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Uspešno ste odgovorili na poziv');
    }

    // Refetch notifications
    queryClient.invalidateQueries({ queryKey: ['notifications'] });

    setIsResponding(false);
  };

  return (
    <Card className={`${notification.status === 'UNREAD' ? 'bg-accent/30' : ''} relative`}>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center">
              {notification.status === NotificationStatus.UNREAD && <DotIcon className="-ml-2" />}
              {notification.title}
            </span>

            <NotificationDropdown notification={notification} />
          </div>
        </CardTitle>
        <CardDescription className="flex items-center">
          <span className="flex items-center gap-2">
            <ClockIcon size={16} /> {formatRelativeTime(new Date(notification.createdAt))}
          </span>
          {notification.status === NotificationStatus.READ && (
            <span className="flex items-center">
              <DotIcon /> Pročitano {formatRelativeTime(new Date(notification.readAt!))}
            </span>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <CardDescription>{notification.message}</CardDescription>
      </CardContent>

      <CardFooter className="relative flex justify-end border-t">
        {notification.type === NotificationType.BASIC ? (
          notification.link ? (
            <ButtonLink
              href={notification.link}
              label="Pogledaj"
              icon={ArrowRightIcon}
              iconPosition="right"
            />
          ) : null
        ) : (
          <>
            {!notification.metadata?.isResponded ? (
              <div className="flex items-center gap-1">
                <Button
                  variant={'outline'}
                  size={'sm'}
                  onClick={() =>
                    handleRespondToInvitation(
                      notification.metadata!.invitationId,
                      false,
                      notification.id,
                    )
                  }
                  disabled={isResponding}
                >
                  <XIcon />
                  Odbij
                </Button>
                <Button
                  variant={'default'}
                  size={'sm'}
                  onClick={() =>
                    handleRespondToInvitation(
                      notification.metadata!.invitationId,
                      true,
                      notification.id,
                    )
                  }
                  disabled={isResponding}
                >
                  <CheckIcon />
                  Prihvati
                </Button>
              </div>
            ) : (
              <span className="text-muted-foreground text-xs">
                {notification.metadata?.isAccepted ? (
                  <span className="flex items-center gap-2">
                    <CheckCheckIcon size={16} /> Prihvaćeno
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <XIcon size={16} /> Odbijeno
                  </span>
                )}
              </span>
            )}
          </>
        )}

        <div className="absolute top-0 left-0 w-full">
          <BarLoader color="green" width={'100%'} height={2} loading={isResponding} />
        </div>
      </CardFooter>
    </Card>
  );
};

export default NotificationCard;
