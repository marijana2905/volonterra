// /apps/next-app/src/app/dashboard/vol/questions/loading.tsx
import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export default function Loading() {
  return (
    <section className="flex flex-col gap-4 p-4">
      <BreadcrumbWrapper items={[{ label: 'Pitanja' }]} homeHref="/dashboard/vol/statistics" />

      <div className="flex flex-col gap-4 md:px-8">
        {/* Search input skeleton */}
        <div className="relative">
          <Skeleton className="h-9 w-full" />
        </div>

        {/* Questions list skeleton */}
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Skeleton className="dark:bg-background h-12 w-12 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="dark:bg-background h-4 w-40" />
                  <Skeleton className="dark:bg-background h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </CardHeader>

            <CardContent className="space-y-3">
              <Skeleton className="dark:bg-background h-4 w-5/6" />
              <Skeleton className="dark:bg-background h-4 w-3/4" />

              {/* Replies header */}
              <div className="mt-2">
                <Skeleton className="dark:bg-background h-4 w-32" />
              </div>

              {/* Replies list */}
              <div className="mt-2 space-y-2">
                {Array.from({ length: 2 }).map((_, j) => (
                  <div key={j} className="rounded-md border p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Skeleton className="dark:bg-background h-8 w-8 rounded-full" />
                      <div className="flex flex-col gap-1">
                        <Skeleton className="dark:bg-background h-3 w-28" />
                        <Skeleton className="dark:bg-background h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="dark:bg-background h-4 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="justify-end border-t">
              <Skeleton className="dark:bg-background h-8 w-36" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
