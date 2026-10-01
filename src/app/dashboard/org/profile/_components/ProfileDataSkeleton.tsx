import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileDataSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 md:px-8">
      {/* Header block with avatar and basic info */}
      <div className="bg-muted/50 flex flex-col items-center gap-4 rounded-lg border p-8 md:flex-row md:items-start md:gap-8">
        <Skeleton className="size-32 rounded-full" />
        <div className="flex w-full flex-col gap-2 text-center md:w-auto md:text-left">
          <Skeleton className="h-7 w-64 md:w-80" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>

      {/* Simulated Accordion (closed items only) */}
      <div className="w-full space-y-2">
        {/* Opis organizacije (with subtitle line) */}
        <div className="bg-background rounded-md border px-4 py-1">
          <div className="flex items-start justify-between py-2">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-80" />
            </div>
            <Skeleton className="h-4 w-4 rounded" />
          </div>
        </div>

        {/* Kontakt informacije */}
        <div className="bg-background rounded-md border px-4 py-1">
          <div className="flex items-start justify-between py-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-4 rounded" />
          </div>
        </div>

        {/* Društvene mreže i linkovi */}
        <div className="bg-background rounded-md border px-4 py-1">
          <div className="flex items-start justify-between py-2">
            <Skeleton className="h-5 w-60" />
            <Skeleton className="h-5 w-4 rounded" />
          </div>
        </div>

        {/* PayPal i broj bankovnog računa */}
        <div className="bg-background rounded-md border px-4 py-1">
          <div className="flex items-start justify-between py-2">
            <Skeleton className="h-5 w-72" />
            <Skeleton className="h-5 w-4 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDataSkeleton;
