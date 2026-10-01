import { getOrganizerStatistics } from '@/data/organizer/getOrganizerStatistics';

import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import SimpleStatisticsCard from '@/app/dashboard/_components/statistics/SimpleStatisticsCard';
import QuestionsRadialChart from './_components/QuestionsRadialChart';
import ActionsPieChart from './_components/ActionsPieChart';

import { Users } from 'lucide-react';

const OrganizerStatisticsPage = async () => {
  const stats = await getOrganizerStatistics();

  return (
    <section className="flex flex-col gap-4 p-4">
      <BreadcrumbWrapper items={[{ label: 'Statistika' }]} homeHref="/dashboard/org/statistics" />

      <div className="flex flex-col gap-4 md:px-8">
        <div className="flex w-full md:max-w-md">
          <SimpleStatisticsCard
            title="Broj volontera sa kojima ste sarađivali"
            value={stats.uniqueVolunteersCount}
            icon={Users}
          />
        </div>

        {/* Charts: side-by-side on md+, stacked on small */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ActionsPieChart
            upcomingCount={stats.upcomingActionsCount}
            ongoingCount={stats.ongoingActionsCount}
            approvalNeededCount={stats.approvalNeededActionsCount}
            completedCount={stats.completedActionsCount}
            cancelledCount={stats.cancelledActionsCount}
          />
          <QuestionsRadialChart
            answeredCount={stats.answeredQuestionsCount}
            unansweredCount={stats.unansweredQuestionsCount}
          />
        </div>
      </div>
    </section>
  );
};

export default OrganizerStatisticsPage;
