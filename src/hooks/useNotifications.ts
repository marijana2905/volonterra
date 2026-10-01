'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Notification } from '@/types/notification.type';

import { markAsReadNotification } from '@/actions/notifications/markNotificationAsRead.action';

import { toast } from 'sonner';
import { NotificationStatus } from '@prisma/types';
import { markAllAsReadNotifications } from '@/actions/notifications/markAllNotificationsAsRead.action';
import { respondToInvitationAction } from '@/actions/team/respondToInvitation.action';
import { useState } from 'react';
import { PaginatedResponse } from '@/types/paginatedResponse.type';

const useNotifications = () => {
  const [isResponding, setIsResponding] = useState(false);
  const [respondingNotificationId, setRespondingNotificationId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Keep a single source of truth for the query key to avoid mismatches
  const queryKey: readonly [string, number] = ['notifications', 1] as const;

  const { data, isLoading, isError, error } = useQuery<PaginatedResponse<Notification>>({
    queryKey,
    queryFn: async () => {
      const response = await fetch('/api/notifications');
      if (!response.ok) throw new Error('Greška prilikom učitavanja obaveštenja');
      const data = await response.json();
      return data;
    },
    refetchInterval: 30_000, // polling
    // refetchIntervalInBackground: true,
  });

  const notifications = data?.items || [];

  const handleRespondToInvitation = async (
    invitationId: string,
    isAccepted: boolean,
    notificationId: string,
  ) => {
    setRespondingNotificationId(notificationId);
    setIsResponding(true);

    const { error } = await respondToInvitationAction(invitationId, isAccepted, notificationId);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Uspešno ste odgovorili na poziv');
    }

    // Refetch notifications
    queryClient.invalidateQueries({ queryKey, exact: true });

    setIsResponding(false);
    setRespondingNotificationId(null);
  };

  const handleMarkAllAsRead = async () => {
    // Optimistic UI update
    queryClient.setQueryData<PaginatedResponse<Notification> | undefined>(queryKey, (old) =>
      old
        ? {
            ...old,
            items: old.items.map((n) => ({
              ...n,
              status: NotificationStatus.READ,
              readAt: new Date(),
            })),
          }
        : old,
    );

    const { error } = await markAllAsReadNotifications();
    if (error) {
      // Refetch ako je došlo do greške da se vrati UI u prethodno stanje
      queryClient.invalidateQueries({ queryKey, exact: true });
      toast.error(error);
    }
  };

  const handleNotificationRead = async (id: string) => {
    // Optimistic UI update
    queryClient.setQueryData<PaginatedResponse<Notification> | undefined>(queryKey, (old) =>
      old
        ? {
            ...old,
            items: old.items.map((n) =>
              n.id === id
                ? { ...n, status: NotificationStatus.READ, readAt: n.readAt ?? new Date() }
                : n,
            ),
          }
        : old,
    );

    const { error } = await markAsReadNotification(id);
    if (error) {
      // Refetch ako je došlo do greške da se vrati UI u prethodno stanje
      queryClient.invalidateQueries({ queryKey, exact: true });
      toast.error(error);
    }
  };

  return {
    notifications,
    isLoading,
    isError,
    error,
    handleMarkAllAsRead,
    handleNotificationRead,
    handleRespondToInvitation,
    isResponding,
    respondingNotificationId,
  };
};

export default useNotifications;
