import React from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ActionCardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between gap-2">
          <Skeleton className="dark:bg-background/80 h-6 w-20" />
          <div className="flex items-center gap-1">
            <Skeleton className="dark:bg-background/80 h-4 w-4 rounded-full" />
            <Skeleton className="dark:bg-background/80 h-4 w-16" />
          </div>
        </div>
        <Skeleton className="dark:bg-background/80 mt-2 h-6 w-3/4" />
      </CardHeader>

      <CardContent className="flex flex-col gap-2 text-sm">
        <div className="flex items-center gap-2">
          <Skeleton className="dark:bg-background/80 h-4 w-4 rounded-full" />
          <Skeleton className="dark:bg-background/80 h-4 w-3/4" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="dark:bg-background/80 h-4 w-4 rounded-full" />
          <Skeleton className="dark:bg-background/80 h-4 w-1/2" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="dark:bg-background/80 h-4 w-4 rounded-full" />
          <Skeleton className="dark:bg-background/80 h-4 w-1/3" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionCardSkeleton;
