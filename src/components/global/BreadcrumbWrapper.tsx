import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import { HomeIcon } from 'lucide-react';

type Crumb = {
  label: string;
  href?: string | null;
  isLoading?: boolean;
};

type BreadcrumbWrapperProps = {
  items: Crumb[];
  homeHref?: string;
};

const BreadcrumbWrapper = ({ items, homeHref = '/dashboard' }: BreadcrumbWrapperProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList className="bg-background p-2">
        <BreadcrumbItem>
          <BreadcrumbLink href={homeHref}>
            <HomeIcon size={16} aria-hidden="true" />
            <span className="sr-only">Home</span>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-center gap-2">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {item.isLoading ? (
                <BreadcrumbPage>
                  <Skeleton className="h-4 w-64" />
                </BreadcrumbPage>
              ) : item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbWrapper;
