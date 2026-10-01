import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MoreVerticalIcon } from 'lucide-react';

const ActionsListSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="bg-background">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20" />
              <MoreVerticalIcon className="text-muted" />
            </div>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>

          <CardContent className="flex-1">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-14" />
            </div>
          </CardContent>

          <Separator />

          <CardFooter className="flex flex-col items-start justify-between gap-2 text-sm md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-12" />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-8" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ActionsListSkeleton;
