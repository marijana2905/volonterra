import React from 'react';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type Props = {
  count?: number;
};

const OrganizationsListLoader = ({ count = 8 }: Props) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, idx) => (
        <Card key={idx} className="relative flex h-full items-center justify-center">
          <CardContent className="flex flex-1 flex-col items-center text-center">
            <Skeleton className="dark:bg-background size-32 rounded-full" />
            <div className="mt-4 w-full flex-1 space-y-2">
              <Skeleton className="dark:bg-background mx-auto h-5 w-3/4" />
              <Skeleton className="dark:bg-background mx-auto h-4 w-1/2" />
            </div>
          </CardContent>
          <CardFooter className="w-full">
            <Skeleton className="dark:bg-background h-10 w-full" />
          </CardFooter>

          <span className="absolute top-6 right-6 flex items-center gap-1">
            <Skeleton className="dark:bg-background h-4 w-4 rounded-md" />
            <Skeleton className="dark:bg-background h-4 w-6" />
          </span>
        </Card>
      ))}
    </div>
  );
};

export default OrganizationsListLoader;
