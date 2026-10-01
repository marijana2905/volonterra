import { Suspense } from 'react';
import { requireOrganizer } from '@/data/auth/requireOrganizer';

import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import ButtonLink from '@/components/global/ButtonLink';

import ActionsListSkeleton from './_components/ActionsListSkeleton';
import ActionsList from './_components/ActionsList';
import FilterSelect from './_components/FilterSelect';

import { PlusIcon } from 'lucide-react';
import { ActionStatusExtended } from '@/types/action.type';

export const metadata = {
  title: 'Akcije',
};

const OrganizerActionsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  await requireOrganizer();

  const filter: ActionStatusExtended =
    ((await searchParams).status as ActionStatusExtended) || 'ALL';

  return (
    <section className="flex flex-col gap-4 p-4">
      <BreadcrumbWrapper items={[{ label: 'Akcije' }]} homeHref="/dashboard/org/statistics" />

      <div className="flex flex-col gap-4 md:px-8">
        <div className="flex items-center justify-between">
          <FilterSelect current={filter} />

          <ButtonLink href="/dashboard/org/actions/add" label="Nova akcija" icon={PlusIcon} />
        </div>

        <Suspense fallback={<ActionsListSkeleton />}>
          <ActionsList filter={filter} />
        </Suspense>
      </div>
    </section>
  );
};

export default OrganizerActionsPage;
