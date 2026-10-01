'use client';

import { Suspense, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { PaginatedResponse } from '@/types/paginatedResponse.type';
import { BlogWithAuthor } from '@/types/blog.type';

import useCustomSearchParams from '@/hooks/useSearchParams';
import { useDebounce } from '@/hooks/useDebounce';

import ContentWrapper from '@/components/global/ContentWrapper';
import BlogIntro from '@/components/blog/BlogIntro';
import { Button } from '@/components/ui/button';
import BlogsList from './_components/BlogsList';
import { Input } from '@/components/ui/input';
import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import CustomDialog from '@/components/global/CustomDialog';
import BlogForm from './_components/BlogForm';
import PaginationBar from '@/components/global/PaginationBar';

import { PlusIcon } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { Skeleton } from '@/components/ui/skeleton';

// Extracted content component that uses useSearchParams under a Suspense boundary
const BlogsPageContent = () => {
  const session = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const { getSearchParam, setSearchParam, removeSearchParam } = useCustomSearchParams();

  const [search, setSearch] = useState(getSearchParam('search') || '');
  const debouncedSearch = useDebounce(search);

  const page = parseInt(getSearchParam('page') || '1', 10);

  const { data, isLoading, isError } = useQuery<PaginatedResponse<BlogWithAuthor>>({
    queryKey: ['blogs', { debouncedSearch, page }],
    queryFn: async () => {
      const res = await fetch(`/api/blog/all?search=${debouncedSearch}&page=${page}`);
      if (!res.ok) throw new Error('Failed to fetch blogs');
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
    <>
      <ContentWrapper className="flex flex-col gap-4">
        <BreadcrumbWrapper homeHref="/" items={[{ label: 'Eko Blog' }]} />

        <BlogIntro />

        <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
          <Input
            placeholder="Pretraga..."
            className="w-full md:w-fit"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {session.isPending ? (
            <Skeleton className="h-10 w-32" />
          ) : (
            session.data && (
              <Button onClick={() => setIsOpen(true)} className="w-full sm:w-fit">
                <PlusIcon /> Dodaj blog
              </Button>
            )
          )}
        </div>

        <BlogsList data={data} isLoading={isLoading} isError={isError} />

        <PaginationBar currentPage={data?.currentPage || 1} totalPages={data?.totalPages || 1} />
      </ContentWrapper>

      {isOpen && (
        <CustomDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title="Dodaj novi blog"
          description="Unesite detalje o vašem blogu"
        >
          <BlogForm onSuccess={() => setIsOpen(false)} />
        </CustomDialog>
      )}
    </>
  );
};

const BlogsClient = () => {
  return (
    <Suspense
      fallback={
        <ContentWrapper className="flex flex-col gap-4">
          <BreadcrumbWrapper homeHref="/" items={[{ label: 'Eko Blog' }]} />
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <div className="flex w-full items-center justify-between gap-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </ContentWrapper>
      }
    >
      <BlogsPageContent />
    </Suspense>
  );
};

export default BlogsClient;
