import type { Metadata } from 'next';
import { Suspense } from 'react';

import ContentWrapper from '@/components/global/ContentWrapper';
import ActionList from '@/components/hero/FeatuedActionsList';
import HeroSection from '@/components/hero/HeroSection';
import OrganizationsCarousel from '@/components/hero/OrganizationsCarousel';
import SectionVolonTerra from '@/components/hero/SectionVolonTerra';

import PageHeader from '@/components/global/PageHeader';
import { getActionsForLandingPage } from '@/data/action/getActionForLandingPage';
import { getStatusForLandingPage } from '@/data/landingPage/getStatusForLandingPage';
import { getAllCategories } from '@/data/admin/getAllCategories';

import { Loader2Icon } from 'lucide-react';
import PartOfVolonTerra from '@/components/hero/PartOfVolonTerra';
import CategoryCard from '@/components/action-category/CategoryCard';

export const metadata: Metadata = {
  title: 'Početna',
  description:
    'VolonTerra je platforma koja povezuje volontere i organizacije ekoloških i volonterskih akcija. Pronađite prilike za volontiranje i doprinesite svojoj zajednici.',
  applicationName: 'VolonTerra',
  authors: [{ name: 'VolonTerra Team' }],
  keywords: [
    'volontiranje',
    'ekologija',
    'akcije',
    'organizacije',
    'zajednica',
    'pomoć',
    'volonteri',
    'VolonTerra',
  ],
  openGraph: {
    title: 'VolonTerra - Budi promena koju želiš da vidiš',
    description:
      'VolonTerra je platforma koja povezuje volontere i organizacije ekoloških i volonterskih akcija.',
    url: process.env.NEXT_PUBLIC_API_URL || 'https://volonterra.rs',
    siteName: 'VolonTerra',
    locale: 'sr_RS',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VolonTerra - Budi promena koju želiš da vidiš',
    description:
      'VolonTerra je platforma koja povezuje volontere i organizacije ekoloških i volonterskih akcija.',
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_API_URL || 'https://volonterra.rs',
  },
};

// TODO: Consider moving data fetch in separate components with fallback to make page SSG
const HomePage = async () => {
  const [actions, { volunteers, organizers, cities, completedActions }, categories] =
    await Promise.all([getActionsForLandingPage(), getStatusForLandingPage(), getAllCategories()]);

  const topCategories = categories.sort((a, b) => (b.count ?? 0) - (a.count ?? 0)).slice(0, 6);

  return (
    <ContentWrapper className="mb-16 flex flex-col gap-16">
      <HeroSection
        totalVolunteers={volunteers}
        totalOrganizations={organizers}
        totalCompletedActions={completedActions}
        totalCities={cities}
      />

      <SectionVolonTerra />

      <ActionList actions={actions} />

      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2Icon className="animate-spin" />
          </div>
        }
      >
        <OrganizationsCarousel />
      </Suspense>

      <section className="flex flex-col items-center justify-center">
        <PageHeader
          title="Kategorije volonterskih akcija"
          description="Najčešće korišćene kategorije volonterskih akcija u našoj zajednici."
        />
        <div className="grid w-full grid-cols-1 gap-4 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {topCategories.map((category) => (
            <CategoryCard key={category.id} category={category} readonly={true} hideChevron />
          ))}
        </div>
      </section>

      <PartOfVolonTerra />
    </ContentWrapper>
  );
};

export default HomePage;
