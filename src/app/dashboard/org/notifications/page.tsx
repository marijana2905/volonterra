import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import NotificiationList from '../../_components/notifications/NotificiationList';
import { requireOrganizer } from '@/data/auth/requireOrganizer';

const OrganizerNotificationsPage = async () => {
  await requireOrganizer();

  return (
    <section className="flex h-full flex-col gap-4 p-4">
      <BreadcrumbWrapper items={[{ label: 'Notifikacije' }]} homeHref="/dashboard/org/statistics" />

      <div className="flex h-full flex-col gap-4 md:px-8">
        <NotificiationList />
      </div>
    </section>
  );
};

export default OrganizerNotificationsPage;
