import { requireVolunteer } from '@/data/auth/requireVolunteer';
import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import TeamsData from './_components/TeamsData';
import { getUserTeams } from '@/data/team/getUserTeams';

export const metadata = {
  title: 'Timovi',
  description: 'Timovi volontera',
};

const VolunteerTeamsPage = async () => {
  const session = await requireVolunteer();
  const { createdTeams, memberTeams } = await getUserTeams(session.user.id);

  return (
    <section className="flex h-full flex-col gap-4 p-4">
      <BreadcrumbWrapper items={[{ label: 'Timovi' }]} homeHref="/dashboard/vol/statistics" />

      <div className="flex h-full flex-col gap-4 md:px-8">
        <TeamsData createdTeams={createdTeams} memberTeams={memberTeams} />
      </div>
    </section>
  );
};

export default VolunteerTeamsPage;
