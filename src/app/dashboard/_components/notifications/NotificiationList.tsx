'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2Icon, MailCheckIcon, SearchIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AlertCard from '@/components/global/AlertCard';
import PaginationBar from '@/components/global/PaginationBar';

import NotificationCard from './NotificationCard';
import NotificationCardSkeleton from './NotificationCardSkeleton';

import useCustomSearchParams from '@/hooks/useSearchParams';
import { useDebounce } from '@/hooks/useDebounce';

import { PaginatedResponse } from '@/types/paginatedResponse.type';
import { Notification } from '@/types/notification.type';

import { markAllAsReadNotifications } from '@/actions/notifications/markAllNotificationsAsRead.action';

const NotificiationList = () => {
  const queryClient = useQueryClient();

  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);

  // Search params
  const { getSearchParam, setSearchParam, removeSearchParam } = useCustomSearchParams();

  const [search, setSearch] = useState(getSearchParam('search') || '');
  const debouncedSearch = useDebounce(search);

  const currentPage = Number(getSearchParam('page') || '1');

  // Fetch
  const { data, isLoading, isError } = useQuery<PaginatedResponse<Notification>>({
    queryKey: ['notifications', currentPage, debouncedSearch],
    queryFn: async () => {
      const res = await fetch(`/api/notifications?page=${currentPage}&search=${debouncedSearch}`);
      if (!res.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await res.json();
      return data;
    },
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setSearchParam('page', '1', { replace: true });

    if (value.length === 0) {
      removeSearchParam('search', { replace: true });
    } else {
      setSearchParam('search', value, { replace: true });
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsMarkingAllAsRead(true);
    const { error } = await markAllAsReadNotifications();

    if (error) {
      toast.error(error);
      setIsMarkingAllAsRead(false);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['notifications'] });
    toast.success('Sve notifikacije su označene kao pročitane.');
    setIsMarkingAllAsRead(false);
  };

  if (isError) {
    return (
      <AlertCard
        variant="destructive"
        title="Došlo je do greške prilikom učitavanja notifikacija."
      />
    );
  }

  return (
    <>
      <div className="flex w-full flex-col-reverse items-center justify-between gap-4 md:flex-row">
        <div className="relative w-full md:w-fit">
          <Input
            type="search"
            value={search}
            onChange={event => handleSearch(event.target.value)}
            placeholder="Pretraži obaveštenja..."
            className="px-9"
          />

          <SearchIcon className="text-muted-foreground/60 absolute top-2 left-2" size={20} />
          {search && (
            <XIcon
              className="text-muted-foreground/60 absolute top-2 right-2"
              size={20}
              onClick={() => handleSearch('')}
            />
          )}
        </div>

        <Button
          onClick={handleMarkAllAsRead}
          disabled={isMarkingAllAsRead || (data?.items.length || 0) === 0}
          className="ml-auto"
        >
          {isMarkingAllAsRead ? <Loader2Icon className="animate-spin" /> : <MailCheckIcon />}
          Označi sve kao pročitano
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-full flex-col gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <NotificationCardSkeleton key={index} />
          ))}
        </div>
      ) : data?.items.length === 0 ? (
        <AlertCard title="Nema notifikacija za prikaz." />
      ) : (
        <div className="flex h-full flex-col gap-4">
          {data?.items.map(notification => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}

          <div className="mt-auto flex justify-end">
            <PaginationBar
              currentPage={data?.currentPage || 1}
              totalPages={data?.totalPages || 1}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default NotificiationList;
