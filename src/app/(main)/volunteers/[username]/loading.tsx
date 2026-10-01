import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import ContentWrapper from '@/components/global/ContentWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const Loading = () => {
  return (
    <ContentWrapper className="flex flex-col">
      <BreadcrumbWrapper
        homeHref="/"
        items={[
          { label: 'Volonteri', href: '/volunteers' },
          { label: 'Učitavanje...', href: '#', isLoading: true },
        ]}
      />

      {/* Header section skeleton (avatar, badges, name, email) */}
      <section className="flex flex-col items-center justify-center p-8 text-center">
        <Skeleton className="size-32 rounded-full" />

        <div className="my-4 flex items-center gap-2">
          <Skeleton className="h-7 w-28 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
        </div>

        <Skeleton className="mb-2 h-8 w-64" />
        <Skeleton className="h-4 w-40" />
      </section>

      {/* Info + contact skeleton grid */}
      <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="bg-card/50 rounded-xl border p-6 shadow">
          <Skeleton className="dark:bg-background mb-4 h-5 w-48" />
          <div className="space-y-3">
            <Skeleton className="dark:bg-background h-4 w-full" />
            <Skeleton className="dark:bg-background h-4 w-5/6" />
            <Skeleton className="dark:bg-background h-4 w-4/6" />
            <Skeleton className="dark:bg-background h-4 w-2/3" />
          </div>
        </div>

        <div className="bg-card/50 rounded-xl border p-6 shadow">
          {/* Kontakt heading */}
          <Skeleton className="dark:bg-background mb-3 h-4 w-24" />
          <div className="space-y-3">
            {[0, 1].map(i => (
              <div
                key={`contact-${i}`}
                className="bg-card/40 flex items-center justify-between gap-4 rounded-lg border p-4"
              >
                <div className="flex min-w-0 items-start gap-4">
                  <Skeleton className="dark:bg-background size-9 rounded-full" />
                  <div className="min-w-0 space-y-2">
                    <Skeleton className="dark:bg-background h-3 w-16" />
                    <Skeleton className="dark:bg-background h-4 w-40" />
                  </div>
                </div>
                <Skeleton className="dark:bg-background h-9 w-9 rounded-md" />
              </div>
            ))}
          </div>

          {/* Društvene mreže heading */}
          <Skeleton className="dark:bg-background mt-6 mb-3 h-4 w-40" />
          <div className="space-y-3">
            {[0, 1].map(i => (
              <div
                key={`social-${i}`}
                className="bg-card/40 flex items-center justify-between gap-4 rounded-lg border p-4"
              >
                <div className="flex min-w-0 items-start gap-4">
                  <Skeleton className="dark:bg-background size-9 rounded-full" />
                  <div className="min-w-0 space-y-2">
                    <Skeleton className="dark:bg-background h-3 w-24" />
                    <Skeleton className="dark:bg-background h-4 w-48" />
                  </div>
                </div>
                <Skeleton className="dark:bg-background h-9 w-9 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements skeleton */}
      <section className="bg-card/50 mt-6 rounded-xl border p-6 text-center shadow">
        <Skeleton className="dark:bg-background mx-auto mb-6 h-5 w-40" />
        <div className="flex flex-wrap justify-center gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="dark:bg-background size-16 rounded-full" />
          ))}
        </div>
      </section>

      {/* Actions carousel skeleton */}
      <section className="mt-12 flex w-full flex-col items-center justify-center">
        <div className="mb-6 text-center">
          <Skeleton className="mx-auto mb-2 h-6 w-80" />
          <Skeleton className="mx-auto h-4 w-96" />
        </div>

        <div className="flex w-full gap-4 px-8">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-full flex-none p-2 md:w-1/2 lg:w-1/3">
              <Skeleton className="h-[28rem] w-full rounded-xl" />
            </div>
          ))}
        </div>
      </section>
    </ContentWrapper>
  );
};

export default Loading;
