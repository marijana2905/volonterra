import { Suspense } from 'react';

import { requireVolunteer } from '@/data/auth/requireVolunteer';

import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import ProfileData from './_components/ProfileData';
import EditProfileLoader from './_components/EditProfileLoader';

export const metadata = {
  title: 'Uređivanje profila',
  description: 'Uređivanje profila volontera',
};

const VolunteerProfilePage = async () => {
  await requireVolunteer();

  return (
    <section className="flex flex-col gap-4 p-4">
      <BreadcrumbWrapper
        items={[{ label: 'Uređivanje profila' }]}
        homeHref="/dashboard/vol/statistics"
      />

      <Suspense fallback={<EditProfileLoader />}>
        <ProfileData />
      </Suspense>
    </section>
  );
};

export default VolunteerProfilePage;
