import { Skeleton } from '@/components/ui/skeleton';

const EditProfileLoader = () => {
  return (
    <div className="flex flex-col gap-4 md:px-8">
      <div className="bg-muted/50 flex flex-col items-center gap-4 rounded border p-8 md:flex-row md:items-start md:gap-8">
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-28 w-28 rounded-full" />
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>
        <div className="flex w-full flex-col gap-2 text-center md:text-left">
          <Skeleton className="h-7 w-48 rounded" />
          <Skeleton className="h-5 w-32 rounded" />
          <Skeleton className="h-5 w-40 rounded" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32 rounded" />
          <Skeleton className="h-52 w-full rounded-md" />
        </div>

        <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
          <div className="w-full space-y-2 md:w-fit">
            <Skeleton className="h-5 w-40 rounded" />
            <Skeleton className="h-10 w-full rounded-md md:w-64" />
          </div>
          <div className="w-full space-y-2 md:w-fit">
            <Skeleton className="h-5 w-40 rounded" />
            <Skeleton className="h-10 w-full rounded-md md:w-64" />
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
          <div className="w-full space-y-2 md:w-fit">
            <Skeleton className="h-5 w-40 rounded" />
            <Skeleton className="h-10 w-full rounded-md md:w-64" />
          </div>
          <div className="w-full space-y-2 md:w-fit">
            <Skeleton className="h-5 w-40 rounded" />
            <Skeleton className="h-10 w-full rounded-md md:w-64" />
          </div>
        </div>

        <Skeleton className="h-10 w-40 rounded-md" />
      </div>
    </div>
  );
};

export default EditProfileLoader;
