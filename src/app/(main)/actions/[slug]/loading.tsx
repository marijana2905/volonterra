import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import ContentWrapper from '@/components/global/ContentWrapper';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const Loading = () => {
  return (
    <ContentWrapper className="flex flex-col gap-8">
      <BreadcrumbWrapper
        homeHref="/"
        items={[
          { label: 'Akcije', href: '/actions' },
          { label: 'Učitavanje...', isLoading: true },
        ]}
      />

      <div className="flex flex-col items-center gap-4">
        <Skeleton className="h-6 w-28 rounded-full" />

        <div className="flex flex-wrap items-center justify-center gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-6 w-24 rounded-full" />
          ))}
        </div>

        <Skeleton className="h-12 w-3/4 max-w-3xl" />

        <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <Card className="flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center gap-4">
              <Skeleton className="dark:bg-background h-12 w-12 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="dark:bg-background h-4 w-40" />
                <Skeleton className="dark:bg-background h-3 w-32" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-3">
            {Array.from({ length: 9 }).map((_, index) => (
              <Skeleton key={index} className="dark:bg-background h-4 w-full" />
            ))}
          </CardContent>
          <CardFooter className="border-t">
            <Skeleton className="dark:bg-background h-10 w-full" />
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardContent className="flex flex-1 flex-col gap-4">
            <Skeleton className="dark:bg-background h-72 w-full rounded-lg" />
          </CardContent>
          <CardFooter className="text-muted-foreground flex flex-col gap-2 border-t">
            <Skeleton className="dark:bg-background h-4 w-40" />
            <Skeleton className="dark:bg-background h-4 w-48" />
          </CardFooter>
        </Card>
      </div>

      <div>
        <div className="mb-4 flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-[304px] w-full rounded-lg" />
      </div>

      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border-dashed">
              <CardContent className="flex flex-col gap-3 py-6">
                <div className="flex items-center gap-3">
                  <Skeleton className="dark:bg-background h-10 w-10 rounded-full" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="dark:bg-background h-4 w-32" />
                    <Skeleton className="dark:bg-background h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="dark:bg-background h-4 w-full" />
                <Skeleton className="dark:bg-background h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ContentWrapper>
  );
};

export default Loading;
