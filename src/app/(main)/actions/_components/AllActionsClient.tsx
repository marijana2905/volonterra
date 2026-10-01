'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useQuery } from '@tanstack/react-query';

import axios from 'axios';

import { ActionsApiResponse } from '@/types/action.type';

import useCustomSearchParams from '@/hooks/useSearchParams';

import { ScrollArea } from '@/components/ui/scroll-area';

import ActionFilters from './filters/ActionFilters';
import ActionsList from './ActionsList';

import { FilterIcon, Loader2Icon } from 'lucide-react';
import SearchFilter from './filters/SearchFilter';
import { Button } from '@/components/ui/button';
import CustomDialog from '@/components/global/CustomDialog';

// ex. GET /api/actions?search=eko&status=ACTIVE,PUBLISHED&city=Belgrade,Novi%20Sad&categorySlug=ciscenje,sadnja&organizerUsername=zeleni_tim&dateFrom=2024-10-01&dateTo=2024-12-31&minParticipants=5&maxParticipants=50&minVolunteers=3&maxVolunteers=20&north=45.5&south=44.5&east=20.6&west=19.5&sort=soonest&page=1&pageSize=24

const ActionsMap = dynamic(() => import('./ActionsMap'), {
  ssr: false,
  loading: () => (
    <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center rounded-xl">
      <Loader2Icon className="animate-spin" />
    </div>
  ),
});

const AllActionsClient = () => {
  const { getSearchParam } = useCustomSearchParams();

  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  const city = getSearchParam('city') || undefined;
  const search = getSearchParam('search') || undefined;
  const dateFrom = getSearchParam('dateFrom') || undefined;
  const dateTo = getSearchParam('dateTo') || undefined;
  const organizerUsername = getSearchParam('organizerUsername') || undefined;
  const status = getSearchParam('status') || undefined;
  const categorySlug = getSearchParam('categorySlug') || undefined;

  const { data, isLoading } = useQuery<ActionsApiResponse>({
    queryKey: [
      'actions',
      {
        city,
        search,
        dateFrom,
        dateTo,
        organizerUsername,
        status,
        categorySlug,
      },
    ],
    queryFn: async () => {
      const response = await axios.get<ActionsApiResponse>('/api/actions', {
        params: {
          city,
          search,
          dateFrom,
          dateTo,
          organizerUsername,
          status,
          categorySlug,
        },
      });
      return response.data;
    },
  });

  const markers = useMemo(() => {
    return (
      data?.data.map((action) => {
        return {
          lat: action.latitude,
          lng: action.longitude,
          title: action.title,
          slug: action.slug,
        };
      }) || []
    );
  }, [data]);

  return (
    <>
      <section className="grid h-full gap-4 lg:max-h-full lg:min-h-0 lg:grid-cols-12">
        <aside className="hidden flex-col gap-4 lg:col-span-3 lg:flex lg:h-full lg:overflow-y-auto lg:pr-2">
          <ActionFilters />
        </aside>

        <div className="flex w-full flex-row items-center justify-between gap-4 lg:hidden">
          <SearchFilter />
          <Button size={'icon'} variant="outline" onClick={() => setIsFilterDialogOpen(true)}>
            <FilterIcon />
          </Button>
        </div>

        <div className="lg:col-span-6 lg:h-full">
          <div className="h-[300px] lg:h-full">
            <ActionsMap markers={markers} height="100%" />
          </div>
        </div>

        <ScrollArea className="lg:col-span-3 lg:h-full lg:overflow-y-auto">
          <ActionsList actions={data?.data} isLoading={isLoading} />
        </ScrollArea>
      </section>

      <CustomDialog
        isOpen={isFilterDialogOpen}
        setIsOpen={setIsFilterDialogOpen}
        title="Filteri akcija"
      >
        <div className="space-y-4">
          <ActionFilters />
          <Button className="w-full" onClick={() => setIsFilterDialogOpen(false)}>
            Primeni filtere
          </Button>
        </div>
      </CustomDialog>
    </>
  );
};

export default AllActionsClient;
