import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import NotificiationList from '../../_components/notifications/NotificiationList';
import { requireVolunteer } from '@/data/auth/requireVolunteer';

const VolunteerNotificationsPage = async () => {
  await requireVolunteer();

  return (
    <section className="flex h-full flex-col gap-4 p-4">
      <BreadcrumbWrapper items={[{ label: 'Notifikacije' }]} homeHref="/dashboard/vol/statistics" />

      <div className="flex h-full flex-col gap-4 md:px-8">
        <NotificiationList />
      </div>
    </section>
  );
};

export default VolunteerNotificationsPage;
