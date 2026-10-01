import { Suspense } from 'react';

import ContentWrapper from '@/components/global/ContentWrapper';
import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import OrganizationsIntro from './_components/OrganizationsIntro';
import OrganizationsList from './_components/OrganizationsList';
import OrganizationsListLoader from './_components/OrganizationsListLoader';

export const metadata = {
  title: 'Organizacije',
  description:
    'Upoznajte organizacije koje stoje iza ekoloških i volonterskih akcija na VolonTerra platformi.',
};

const OrganizationsPage = () => {
  return (
    <ContentWrapper className="flex flex-col">
      <BreadcrumbWrapper homeHref="/" items={[{ label: 'Organizacije' }]} />

      <OrganizationsIntro />

      <Suspense fallback={<OrganizationsListLoader />}>
        <OrganizationsList />
      </Suspense>
    </ContentWrapper>
  );
};

export default OrganizationsPage;
