import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import { requireVolunteer } from '@/data/auth/requireVolunteer';
import EditZonesContainer from './_components/EditZonesContainer';
import { getVolunteerZones } from '@/data/volunteer/getVolunteerZones';
import Loading from './loading';

export const metadata = {
  title: 'Zone interesa',
};

const VolunteerZonesPage = async () => {
  await requireVolunteer();
  const zones = await getVolunteerZones();

  return (
    <>
      <section className="flex h-full flex-col gap-4 p-4">
        <BreadcrumbWrapper
          items={[{ label: 'Zone interesa' }]}
          homeHref="/dashboard/vol/statistics"
        />
        <EditZonesContainer zones={zones} />
      </section>
    </>
  );
};

export default VolunteerZonesPage;
