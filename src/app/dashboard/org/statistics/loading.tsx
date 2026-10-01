import React from 'react';

import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const Loading = () => {
  return (
    <section className="flex flex-col gap-4 p-4">
      <BreadcrumbWrapper items={[{ label: 'Statistika' }]} homeHref="/dashboard/org/statistics" />

      <div className="flex flex-col gap-4 md:px-8">
        {/* Simple statistics card skeleton */}
        <div className="flex w-full md:max-w-md">
          <Card className="w-full">
            <CardContent className="bg-card flex items-center gap-6 rounded-xl">
              <Skeleton className="dark:bg-background size-12 flex-shrink-0 rounded-xl" />
              <div className="flex flex-col justify-center gap-2 py-2">
                <Skeleton className="dark:bg-background h-4 w-48" />
                <Skeleton className="dark:bg-background h-6 w-32" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts: side-by-side on md+, stacked on small */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Actions pie chart skeleton */}
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Skeleton className="dark:bg-background size-12 rounded-xl" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="dark:bg-background h-5 w-40" />
                  <Skeleton className="dark:bg-background h-4 w-56" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <Skeleton className="dark:bg-background mx-auto h-96 w-full max-w-[420px]" />
            </CardContent>
          </Card>

          {/* Questions radial chart skeleton */}
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Skeleton className="dark:bg-background size-12 rounded-xl" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="dark:bg-background h-5 w-32" />
                  <Skeleton className="dark:bg-background h-4 w-56" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
              <Skeleton className="dark:bg-background mx-auto h-96 w-full max-w-[420px]" />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Loading;
