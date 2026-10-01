import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import { BarLoader } from 'react-spinners';

export default function Loading() {
  return (
    <div className="relative flex flex-col gap-4 p-4">
      <BreadcrumbWrapper
        items={[
          { label: 'Akcije', href: '/dashboard/org/actions' },
          { label: 'Učitavanje...' },
          { label: 'Prijave' },
        ]}
        homeHref="/dashboard/org/statistics"
      />

      <div className="md:px-8">
        <div className="fixed top-16 left-0 w-full">
          <BarLoader width="100%" color="green" />
        </div>
      </div>
    </div>
  );
}
