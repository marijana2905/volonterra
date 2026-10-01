import { MAX_ORGANIZER_GALLERY_IMAGES } from '@/lib/constants';

import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';

import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { PlusIcon } from 'lucide-react';

export default function Loading() {
  return (
    <section className="flex flex-col gap-4 p-4">
      <BreadcrumbWrapper items={[{ label: 'Galerija' }]} homeHref="/dashboard/org/" />
      <div className="flex flex-col gap-4 md:px-8">
        <div className="flex items-center justify-between">
          <Badge variant={'outline'}>?/{MAX_ORGANIZER_GALLERY_IMAGES}</Badge>

          <Button>
            <PlusIcon /> Dodaj fotografije
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: MAX_ORGANIZER_GALLERY_IMAGES }).map((_, index) => (
            <div key={index} className="relative rounded-xl">
              <div className="overflow-hidden rounded-xl">
                <Skeleton className="aspect-square w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
