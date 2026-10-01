import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const NotificationCardSkeleton = () => {
  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2">
              <Skeleton className="dark:bg-background h-3 w-3 rounded-full" />
              <Skeleton className="dark:bg-background h-5 w-48" />
            </span>
            <Skeleton className="dark:bg-background h-8 w-8 rounded-md" />
          </div>
        </CardTitle>
        <CardDescription className="flex items-center gap-4">
          <Skeleton className="dark:bg-background h-4 w-28" />
          <Skeleton className="dark:bg-background h-4 w-24" />
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <Skeleton className="dark:bg-background h-4 w-full" />
        <Skeleton className="dark:bg-background h-4 w-3/4" />
      </CardContent>

      <CardFooter className="flex justify-end border-t">
        <Skeleton className="dark:bg-background h-8 w-24" />
      </CardFooter>
    </Card>
  );
};

export default NotificationCardSkeleton;
