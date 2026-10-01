import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import ActionFormStepper from '../_components/ActionFormStepper';
import Step1 from '../_components/Step1';
import { BarLoader } from 'react-spinners';

export default function Loading() {
  return (
    <div className="relative flex flex-col gap-4 p-4">
      <BreadcrumbWrapper
        items={[{ label: 'Akcije', href: '/dashboard/org/actions' }, { label: 'Učitavanje...' }]}
        homeHref="/dashboard/org/statistics"
      />

      <div className="md:px-8">
        <div className="pointer-events-none relative mb-4 flex w-full flex-col gap-8 overflow-hidden py-4 opacity-50 md:mb-8 md:gap-12 md:rounded-xl md:border md:p-8">
          <ActionFormStepper currentStep={1} />

          <Step1
            defaultValues={{
              title: 'Učitavanje...',
              description: 'Učitavanje...',
              categories: [],
            }}
          />
        </div>
        <div className="fixed top-16 left-0 w-full">
          <BarLoader width="100%" color="green" />
        </div>
      </div>
    </div>
  );
}
