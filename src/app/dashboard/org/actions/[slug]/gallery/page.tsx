import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import { getActionWithParticipations } from '@/data/action/getActionWithParticipations';
import { getActionStatusExtended } from '@/lib/utils';
import { redirect } from 'next/navigation';
import NotFound from './not-found';

export const metadata = {
  title: 'Prijave',
};

type Props = {
  params: Promise<{ slug: string }>;
};

const ActionGalleryPage = async (props: Props) => {
  const { slug } = await props.params;
  const action = await getActionWithParticipations(slug);

  if (!action) {
    return NotFound();
  }

  if (action.status !== 'COMPLETED') {
    redirect(`/dashboard/org/actions`);
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
          { label: 'Galerija' },
        ]}
        homeHref="/dashboard/org/statistics"
      />

      <div className="flex flex-col gap-4 md:px-8">Gallery will go here!</div>
    </div>
  );
};

export default ActionGalleryPage;
