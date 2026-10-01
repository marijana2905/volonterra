import ContentWrapper from '@/components/global/ContentWrapper';
import AllActionsClient from './_components/AllActionsClient';
import { Suspense } from 'react';

export const metadata = {
  title: 'Akcije',
  description:
    'Pregledajte i prijavite se na aktuelne volonterske i ekološke akcije u vašoj okolini.',
};

const AllActionsPage = () => {
  return (
    <ContentWrapper className="flex flex-col gap-4 lg:h-[calc(100vh-4rem)]">
      <Suspense fallback={<div>Učitavanje...</div>}>
        <AllActionsClient />
      </Suspense>
    </ContentWrapper>
  );
};

export default AllActionsPage;
