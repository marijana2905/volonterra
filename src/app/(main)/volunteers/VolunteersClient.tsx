'use client';

import ContentWrapper from '@/components/global/ContentWrapper';
import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import VolunteersIntro from './_components/VolunteersIntro';
import { Suspense, useState } from 'react';
import useCustomSearchParams from '@/hooks/useSearchParams';
import { useDebounce } from '@/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { PaginatedResponse } from '@/types/paginatedResponse.type';
import { Volunteer } from '@prisma/types';
import { Input } from '@/components/ui/input';
import PaginationBar from '@/components/global/PaginationBar';
import VolunteersList from './_components/VolunteersList';
import { Skeleton } from '@/components/ui/skeleton';

// Child component that uses useSearchParams and related hooks.
const VolunteersPageContent = () => {
  const { getSearchParam, setSearchParam, removeSearchParam } = useCustomSearchParams();

  const [search, setSearch] = useState(getSearchParam('search') || '');
  const debouncedSearch = useDebounce(search);

  const page = parseInt(getSearchParam('page') || '1', 10);

  const { data, isLoading, isError } = useQuery<PaginatedResponse<Volunteer>>({
    queryKey: ['volunteers', { debouncedSearch, page }],
    queryFn: async () => {
      const res = await fetch(`/api/volunteers?search=${debouncedSearch}&page=${page}`);
      if (!res.ok) throw new Error('Failed to fetch volunteers');
      return res.json();
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

  return (
    <ContentWrapper className="flex flex-col gap-4">
      <BreadcrumbWrapper homeHref="/" items={[{ label: 'Volonteri' }]} />

      <VolunteersIntro />

      <Input
        placeholder="Pretraga..."
        className="w-fit"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <VolunteersList data={data} isLoading={isLoading} isError={isError} />

      <PaginationBar currentPage={data?.currentPage || 1} totalPages={data?.totalPages || 1} />
    </ContentWrapper>
  );
};

const VolunteersClient = () => {
  return (
    <Suspense
      fallback={
        <ContentWrapper className="flex flex-col gap-4">
          <BreadcrumbWrapper homeHref="/" items={[{ label: 'Volonteri' }]} />
          <VolunteersIntro />
        </ContentWrapper>
      }
    >
      <VolunteersPageContent />
    </Suspense>
  );
};

export default VolunteersClient;
