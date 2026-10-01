import { getVolunteerParticipations } from '@/data/volunteer/getVolunteerParticipations';
import { requireVolunteer } from '@/data/auth/requireVolunteer';
import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import ParticipationsTable from './_components/ParticipationsTable';

const MyParticipationsPage = async () => {
  const session = await requireVolunteer();
  const usersActions = await getVolunteerParticipations(session.user.id);

  return (
    <section className="flex flex-col gap-4 p-4">
      <BreadcrumbWrapper items={[{ label: 'Moje prijave' }]} homeHref="/dashboard/vol/statistics" />

      <ParticipationsTable participations={usersActions} />
    </section>
  );
};

export default MyParticipationsPage;
