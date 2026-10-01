import Link from 'next/link';
import { formatRelativeTime } from '@/lib/utils';

import { NotificationStatus } from '@prisma/types';
import { Notification } from '@/types/notification.type';

import { Button } from '@/components/ui/button';
import { ArrowRightIcon, DotIcon } from 'lucide-react';

type Props = {
  notification: Notification;
};

const MAX_MESSAGE_LENGTH = 100;

const truncate = (text: string, max = MAX_MESSAGE_LENGTH) =>
  text.length > max ? text.slice(0, max) + '...' : text;

const BasicNotificationCard = ({ notification }: Props) => {
  const message = truncate(notification.message ?? '');

  return (
    <div className="relative flex-col gap-1 border-b px-3 py-2 text-sm">
      <div className="flex items-start justify-between gap-2">
        <h1 className="font-semibold">{notification.title}</h1>
        {notification.status === NotificationStatus.UNREAD && <DotIcon />}
      </div>

      <span className="text-muted-foreground text-xs">{message}</span>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-muted-foreground text-xs">
          {formatRelativeTime(new Date(notification.createdAt))}
        </span>

        {notification.link && (
          <Button size={'sm'} asChild>
            <Link href={notification.link}>
              Pogledaj <ArrowRightIcon />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default BasicNotificationCard;
