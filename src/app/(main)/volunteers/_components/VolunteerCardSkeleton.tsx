import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const VolunteerCardSkeleton = () => {
  return (
    <Card className="relative">
      <CardContent className="flex flex-1 flex-col items-center justify-center text-center">
        <Skeleton className="dark:bg-background size-32 rounded-full" />

        <div className="mt-4 flex w-full flex-col items-center gap-2">
          <Skeleton className="dark:bg-background h-5 w-40" />
          <Skeleton className="dark:bg-background h-4 w-28" />
        </div>
      </CardContent>

      <CardFooter>
        <Skeleton className="dark:bg-background h-10 w-full" />
      </CardFooter>

      <Skeleton className="dark:bg-background absolute top-6 right-6 h-4 w-10" />
    </Card>
  );
};

export default VolunteerCardSkeleton;
