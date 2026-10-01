import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import { getActionWithParticipations } from '@/data/action/getActionWithParticipations';
import NotFound from './not-found';
import { getActionStatusExtended } from '@/lib/utils';
import UsersTable from './_components/UsersTable';
import AlertCard from '@/components/global/AlertCard';
import ButtonLink from '@/components/global/ButtonLink';
import { ImagesIcon } from 'lucide-react';

export const metadata = {
  title: 'Prijave',
};

type Props = {
  params: Promise<{ slug: string }>;
};

const ActionParticipationPage = async (props: Props) => {
  const { slug } = await props.params;
  const action = await getActionWithParticipations(slug);

  if (!action) {
    return NotFound();
  }
  const actionStatusExtended = getActionStatusExtended(
    action.fullDateFrom,
    action.fullDateTo,
    action.status
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <BreadcrumbWrapper
        items={[
          { label: 'Akcije', href: '/dashboard/org/actions' },
          {
            label: action.title,
            href: `/actions/${action.slug}`,
          },
          { label: 'Prijave' },
        ]}
        homeHref="/dashboard/org/statistics"
      />

      <div className="flex flex-col gap-4 md:px-8">
        {actionStatusExtended === 'APPROVAL_NEEDED' && (
          <AlertCard
            variant="destructive"
            title="Potrebna potvrda"
            description="Označite korisnike koji su bili prisutni kako biste potvrdili njihovo prisustvo i time proglasili akciju završenom."
          />
        )}

        {/* {actionStatusExtended === 'COMPLETED' && (
          <div className="flex justify-end">
            <ButtonLink
              href={`/dashboard/org/actions/${action.slug}/gallery`}
              label="Uredi galeriju akcije"
              icon={ImagesIcon}
            />
          </div>
        )} */}

        <UsersTable
          slug={slug}
          actionId={action.id}
          users={action.participations}
          actionStatusExtended={actionStatusExtended}
        />
      </div>
    </div>
  );
};

export default ActionParticipationPage;
