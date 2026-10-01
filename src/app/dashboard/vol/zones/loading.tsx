import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PlusIcon } from 'lucide-react';

export default function Loading() {
  return (
    <section className="flex h-full flex-col gap-4 p-4">
      <BreadcrumbWrapper items={[{ label: 'Zone interesa' }]} homeHref="/dashboard/org/" />

      <div className="flex h-full flex-col gap-4 md:px-8">
        {/* zone EditZonesContainer skeleton goes here */}
        <div className="flex justify-end">
          <Button>
            <PlusIcon />
            Dodaj zonu
          </Button>
        </div>

        <div className="flex h-full flex-1 flex-col gap-4 lg:flex-row">
          {/* left column - list skeletons */}
          <div className="flex w-full flex-col gap-4 lg:w-4/12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-0 shadow-none">
                <div className="flex items-center justify-between gap-2 rounded-md bg-white/5 p-4">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-32 rounded" />
                    <Skeleton className="h-3 w-20 rounded" />
                  </div>
                  <Skeleton className="h-5 w-5 rounded" />
                </div>
              </div>
            ))}
          </div>

          {/* right column - map skeleton */}
          <div className="flex h-[500px] w-full lg:h-full lg:w-8/12">
            <Skeleton className="h-full w-full rounded-xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
