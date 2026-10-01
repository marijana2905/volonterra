import { requireAdmin } from '@/data/auth/requireAdmin';
import { getStatisticForAdmin } from '@/data/admin/getStatisticForAdmin';
import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import Statistic from '../_components/Statistics';
import ActionsPieChart from '../../org/statistics/_components/ActionsPieChart';
import { getAllActionsStatistics } from '@/data/admin/getActionsStatistic';

const AdminStatisticsPage = async () => {
  await requireAdmin();

  const stats = await getStatisticForAdmin();
  const stat = await getAllActionsStatistics();

  return (
    <section className="flex flex-col gap-4 p-4">
      <BreadcrumbWrapper
        items={[{ label: 'Kontrolna tabla' }]}
        homeHref="/dashboard/admin/statistics"
      />

      <div className="flex flex-col gap-4 md:px-8">
        <Statistic stats={stats} />
        <ActionsPieChart
          upcomingCount={stat.upcomingActionsCount}
          ongoingCount={stat.ongoingActionsCount}
          approvalNeededCount={stat.approvalNeededActionsCount}
          completedCount={stat.completedActionsCount}
          cancelledCount={stat.cancelledActionsCount}
        />

        {/* Banovani volonteri
        <div className="bg-muted flex h-64 w-full items-center justify-center rounded-lg">
          <h2 className="text-2xl font-semibold">Banovani volonteri</h2>
        </div>

        {/* Banovani organizatori */}
        {/* <div className="bg-muted flex h-64 w-full items-center justify-center rounded-lg">
          <h2 className="text-2xl font-semibold">Banovani organizatori</h2>
        </div>  */}

        {/* Statistika */}
      </div>
    </section>
  );
};

export default AdminStatisticsPage;
