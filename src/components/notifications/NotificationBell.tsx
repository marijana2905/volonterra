'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import useNotifications from '@/hooks/useNotifications';

import { NotificationStatus, NotificationType } from '@prisma/types';

import BasicNotificationCard from './BasicNotificationCard';
import TeamInviteNotificationCard from './TeamInviteNotificationCard';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { ArrowRightIcon, BellIcon, Loader2Icon } from 'lucide-react';
import { useSession } from '@/lib/auth-client';

const NotificationBell = () => {
  const session = useSession();
  const role = session?.data?.user.role;

  const {
    notifications,
    isLoading,
    handleMarkAllAsRead,
    handleNotificationRead,
    handleRespondToInvitation,
    isResponding,
    respondingNotificationId,
  } = useNotifications();

  const unreadCount =
    notifications?.filter((n) => n.status === NotificationStatus.UNREAD).length ?? 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="outline" className="relative" aria-label="Open notifications">
          <BellIcon size={16} aria-hidden="true" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-1" align="end">
        <div className="flex items-baseline justify-between gap-4 px-3 py-2">
          <div className="text-sm font-semibold">Obaveštenja</div>
          {unreadCount > 0 && (
            <button
              className="hover:text-primary text-xs font-medium transition-colors"
              onClick={handleMarkAllAsRead}
            >
              Označi sve kao pročitano
            </button>
          )}
        </div>

        <div
          role="separator"
          aria-orientation="horizontal"
          className="bg-border -mx-1 my-1 h-px"
        ></div>

        <ScrollArea className="h-96">
          {isLoading && (
            <div className="text-muted-foreground flex items-center justify-center py-2">
              <Loader2Icon className="animate-spin" />
            </div>
          )}

          {!isLoading && (notifications?.length ?? 0) === 0 && (
            <div className="text-muted-foreground p-4 text-center text-sm">Nema obaveštenja</div>
          )}

          {(notifications ?? []).map((notification) => (
            <div
              key={notification.id}
              className={cn(
                'hover:bg-accent/50 transition-colors',
                notification.status === NotificationStatus.UNREAD && 'bg-accent/30',
              )}
              onClick={() => handleNotificationRead(notification.id)} // Kada je samo kartica kliknuta oznaci kao procitano
            >
              {notification.type === NotificationType.TEAM_INVITE && (
                <TeamInviteNotificationCard
                  notification={notification}
                  onRespond={handleRespondToInvitation}
                  isLoading={isResponding && respondingNotificationId === notification.id} // Ovo sluzi da bi se loading state prikazao samo na jednoj notifikaciji
                />
              )}

              {notification.type === NotificationType.BASIC && (
                <BasicNotificationCard notification={notification} />
              )}
            </div>
          ))}
        </ScrollArea>

        <div className="flex w-full px-3 py-2 text-center">
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link href={`/dashboard/${role === 'VOLUNTEER' ? 'vol' : 'org'}/notifications`}>
              Pogledaj sve <ArrowRightIcon />
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
