import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <section className="flex h-full flex-col gap-4 p-4">
      <BreadcrumbWrapper items={[{ label: 'Timovi' }]} homeHref="/dashboard/vol/statistics" />

      <div className="flex h-full flex-col gap-4 md:px-8">
        <div className="flex h-[calc(100vh-9.3rem)] w-full flex-col gap-4 lg:flex-row">
          {/* Left card */}
          <div className="bg-background h-full w-full shrink-0 rounded-lg border p-3 lg:w-[360px] xl:w-[400px]">
            <Skeleton className="h-full w-full rounded-md" />
          </div>

          {/* Right card */}
          <div className="bg-background h-full flex-1 rounded-lg border p-3">
            <Skeleton className="h-full w-full rounded-md" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Loading;
