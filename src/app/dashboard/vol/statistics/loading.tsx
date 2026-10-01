import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Loading = () => {
  return (
    <section className="flex flex-col gap-4 p-4">
      <BreadcrumbWrapper items={[{ label: 'Statistika' }]} homeHref="/dashboard/vol/statistics" />

      <div className="flex flex-col gap-4 md:px-8">
        {/* Top stats grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-8">
              <div className="flex items-center gap-4">
                <Skeleton className="dark:bg-background h-10 w-10 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="dark:bg-background h-4 w-40" />
                  <Skeleton className="dark:bg-background h-6 w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom section: points/badge + chart */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          {/* Left column: points card + badge card */}
          <div className="flex flex-row gap-4 md:w-2/5 md:flex-col">
            <Card className="p-8">
              <div className="flex items-center gap-4">
                <Skeleton className="dark:bg-background h-10 w-10 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="dark:bg-background h-4 w-40" />
                  <Skeleton className="dark:bg-background h-6 w-24" />
                </div>
              </div>
            </Card>

            <Card className="flex w-1/2 items-center gap-4 p-4 md:w-full">
              <Skeleton className="dark:bg-background h-4 w-28" />
              <Skeleton className="dark:bg-background h-[164px] w-[164px] rounded-md" />
              <Skeleton className="dark:bg-background h-6 w-24" />
            </Card>
          </div>

          {/* Right column: actions per month chart */}
          <div className="w-full md:w-3/5">
            <Card className="p-4">
              <Skeleton className="dark:bg-background h-96 w-full" />
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Loading;
