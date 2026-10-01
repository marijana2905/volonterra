import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import AccountAndPasswordChange from '../../_components/settings/AccountAndPasswordChange';

const AdminSettingsPage = () => {
  return (
    <section className="flex flex-col gap-4 p-4">
      <BreadcrumbWrapper
        items={[{ label: 'Podešavanja' }]}
        homeHref="/dashboard/admin/statistics"
      />

      <div className="flex flex-col gap-4 md:px-8">
        <AccountAndPasswordChange />
      </div>
    </section>
  );
};

export default AdminSettingsPage;
