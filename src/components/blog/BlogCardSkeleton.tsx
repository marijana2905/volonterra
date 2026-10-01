import React from 'react';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const BlogCardSkeleton = () => {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="dark:bg-background size-8 rounded-full" />
            <Skeleton className="dark:bg-background h-5 w-24" />
          </div>

          <span className="text-muted-foreground">
            <Skeleton className="dark:bg-background h-4 w-4 rounded-full" />
          </span>

          <Skeleton className="dark:bg-background h-4 w-20" />
        </div>

        <Skeleton className="dark:bg-background h-7 w-3/4" />
      </CardHeader>

      <CardContent className="flex-1 space-y-2">
        <Skeleton className="dark:bg-background h-4 w-full" />
        <Skeleton className="dark:bg-background h-4 w-11/12" />
        <Skeleton className="dark:bg-background h-4 w-5/6" />
      </CardContent>

      <CardFooter className="justify-end">
        <Skeleton className="dark:bg-background h-4 w-24" />
      </CardFooter>
    </Card>
  );
};

export default BlogCardSkeleton;
