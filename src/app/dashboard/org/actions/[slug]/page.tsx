import { ActionStatus } from '@prisma/types';

import { getActionForEdit } from '@/data/action/getActionForEdit';

import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import AlertCard from '@/components/global/AlertCard';

import ActionFormWizard from '../_components/ActionFormWizard';
import NotFound from './not-found';
import { canEditAction } from '@/lib/utils';

export const metadata = {
  title: 'Uredi akciju',
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

const EditActionPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const action = await getActionForEdit(slug);

  if (!action) {
    return NotFound();
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <BreadcrumbWrapper
        items={[
          { label: 'Akcije', href: '/dashboard/org/actions' },
          { label: action.title, href: `/actions/${action.slug}` },
        ]}
        homeHref="/dashboard/org/statistics"
      />

      <div className="md:px-8">
        {action.status === ActionStatus.CANCELLED ? (
          <AlertCard
            variant="destructive"
            title="Greška: Akcija je otkazana"
            description="Ne možete uređivati otkazane akcije."
          />
        ) : !canEditAction(action.fullDateFrom, action.status) ? (
          <AlertCard
            variant="destructive"
            title="Greška:"
            description="Ne možete uređivati akcije koje su u toku, počinju u roku od 48 sati ili su završene."
          />
        ) : (
          <ActionFormWizard
            initialData={{
              title: action.title,
              description: action.description,
              categories: action.categories.map((category) => category.id),
              latitude: action.latitude,
              longitude: action.longitude,
              city: action.city,
              address: action.address,
              dateRange: {
                from: action.fullDateFrom,
                to: action.fullDateTo,
              },
              startTime: action.startTime,
              endTime: action.endTime,
              minParticipants: action.minParticipants,
              maxParticipants: action.maxParticipants,
              bannerImage: action.bannerImage,
            }}
            isEdit
            id={action.id}
          />
        )}
      </div>
    </div>
  );
};

export default EditActionPage;
