import { Suspense } from 'react';
import { requireOrganizer } from '@/data/auth/requireOrganizer';

import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';

import ProfileDataSkeleton from './_components/ProfileDataSkeleton';
import ProfileData from './_components/ProfileData';

export const metadata = {
  title: 'Uređivanje profila',
  description: 'Uređivanje profila organizatora',
};

const OrganizerProfilePage = async () => {
  await requireOrganizer();

  return (
    <section className="flex flex-col gap-4 p-4">
      <BreadcrumbWrapper
        items={[{ label: 'Uređivanje profila' }]}
        homeHref="/dashboard/org/statistics"
      />

      <Suspense fallback={<ProfileDataSkeleton />}>
        <ProfileData />
      </Suspense>
    </section>
  );
};

export default OrganizerProfilePage;
