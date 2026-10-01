// /apps/next-app/src/app/dashboard/vol/actions/loading.tsx
import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const HEADER_COLS = [
  { w: 'w-[200px]', label: 'Naziv akcije' },
  { w: 'w-[150px]', label: 'Lokacija' },
  { w: 'w-[200px]', label: 'Datum' },
  { w: 'w-[120px]', label: 'Status' },
  { w: 'w-[100px]', label: 'Tip' },
  { w: 'w-[60px]', label: '' },
];

export default function Loading() {
  return (
    <div className="relative flex flex-col gap-4 p-4">
      <BreadcrumbWrapper items={[{ label: 'Moje prijave' }]} homeHref="/dashboard/vol/statistics" />

      <div className="flex flex-col gap-4 md:px-8">
        <div className="ml-auto">
          <Skeleton className="h-9 w-44 rounded-md" />
        </div>
        <div className="bg-background overflow-hidden rounded-md border">
          <div className="table w-full table-fixed">
            {/* Header */}
            <div className="bg-muted/40 table-header-group">
              <div className="table-row">
                {HEADER_COLS.map(col => (
                  <div
                    key={col.label + col.w}
                    className={`text-muted-foreground table-cell h-11 px-4 align-middle text-xs font-medium ${col.w}`}
                  ></div>
                ))}
              </div>
            </div>
            {/* Body */}
            <div className="table-row-group">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="table-row border-t last:border-b-0 hover:bg-transparent [&>*]:px-4 [&>*]:py-3"
                >
                  {/* Naziv akcije */}
                  <div className="table-cell">
                    <Skeleton className="h-4 w-40" />
                  </div>
                  {/* Lokacija */}
                  <div className="table-cell">
                    <Skeleton className="h-4 w-32" />
                  </div>
                  {/* Datum */}
                  <div className="table-cell">
                    <Skeleton className="h-4 w-36" />
                  </div>
                  {/* Status */}
                  <div className="table-cell">
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </div>
                  {/* Tip */}
                  <div className="table-cell">
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  {/* Actions */}
                  <div className="table-cell">
                    <Skeleton className="mx-auto h-5 w-5 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination + controls skeleton */}
        <div className="flex items-center justify-between gap-8">
          {/* Page size */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-12 rounded-md" />
          </div>

          {/* Page info */}
          <div className="flex grow justify-end">
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-1">
            {[ChevronFirstIcon, ChevronLeftIcon, ChevronRightIcon, ChevronLastIcon].map(
              (Icon, idx) => (
                <Button
                  key={idx}
                  size="icon"
                  variant="outline"
                  disabled
                  className="relative"
                  aria-hidden="true"
                >
                  <Icon size={16} />
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
