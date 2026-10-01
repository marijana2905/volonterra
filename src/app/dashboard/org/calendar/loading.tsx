import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <section className="flex flex-col gap-4 p-4">
      <BreadcrumbWrapper items={[{ label: 'Kalendar' }]} homeHref="/dashboard/org/" />
      <div className="flex flex-col gap-4 md:px-8">
        <div className="flex flex-col rounded-lg md:border">
          {/* Header */}
          <div className="flex items-center justify-between p-2 sm:p-4">
            <div className="flex items-center gap-1 sm:gap-4">
              <Skeleton className="h-9 w-9 sm:w-16" />
              <div className="ml-2 flex items-center gap-1 sm:ml-4 sm:gap-4">
                <Skeleton className="h-6 w-6" />
                <Skeleton className="h-6 w-6" />
              </div>
              <Skeleton className="ml-2 h-6 w-32 sm:w-40" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-10 sm:w-20" />
            </div>
          </div>

          {/* Calendar content */}
          <div className="flex flex-1 flex-col">
            <div className="h-8 w-full"></div>

            {/* Calendar days grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: 35 }).map((_, i) => (
                <Skeleton key={`day-${i}`} className="h-32 w-full rounded-none" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
