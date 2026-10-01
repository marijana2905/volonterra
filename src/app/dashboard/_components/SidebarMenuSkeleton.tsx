import { Skeleton } from '@/components/ui/skeleton';

export default function SidebarMenuSkeleton() {
  return (
    <nav aria-label="Sidebar menu loading" className="mt-2 space-y-4 px-2">
      {[...Array(6)].map((_, idx) => (
        <div key={idx} className="flex items-center">
          <Skeleton className="mr-1 h-5 w-5 rounded" />
          <Skeleton className="h-5 w-full rounded" />
        </div>
      ))}
    </nav>
  );
}
