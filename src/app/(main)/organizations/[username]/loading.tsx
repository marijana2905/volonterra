import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import ContentWrapper from '@/components/global/ContentWrapper';
import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <ContentWrapper className="flex flex-col">
      <BreadcrumbWrapper
        homeHref="/"
        items={[
          { label: 'Organizacije', href: '/organizations' },
          { label: 'Učitavanje...', isLoading: true },
        ]}
      />

      <section className="flex flex-col items-center justify-center p-8 text-center">
        <Skeleton className="size-32 rounded-full" />

        <Skeleton className="mt-4 h-10 w-64" />

        <span className="my-4 flex items-center gap-4">
          <Skeleton className="h-6 w-48" />

          <Skeleton className="size-10 rounded-md" />
        </span>
      </section>

      <div className="mb-4 w-full">
        <div className="mx-auto mb-3 flex h-auto w-full max-w-2xl gap-2 border-b px-0 py-1">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
        </div>

        <div className="space-y-4 rounded-xl border p-8 shadow">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>

      <Skeleton className="my-8 h-96 w-full rounded-xl" />

      <section className="my-12 flex w-full flex-col items-center gap-8">
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>

          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        </div>

        <Skeleton className="mt-8 h-10 w-48" />
      </section>
    </ContentWrapper>
  );
};

export default Loading;
