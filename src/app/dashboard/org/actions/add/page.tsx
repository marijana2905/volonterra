import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import ActionFormWizard from '../_components/ActionFormWizard';

export const metadata = {
  title: 'Nova akcija',
};

const AddAction = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <BreadcrumbWrapper
        items={[{ label: 'Akcije', href: '/dashboard/org/actions' }, { label: 'Nova akcija' }]}
        homeHref="/dashboard/org/statistics"
      />

      <div className="md:px-8">
        <ActionFormWizard />
      </div>
    </div>
  );
};

export default AddAction;
