import PageHeader from '@/components/global/PageHeader';
import OrganizerCard from '@/components/global/OrganizerCard';

import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { getOrganizers } from '@/data/organizer/getOrganizers';
import { Button } from '../ui/button';
import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

const OrganizationsCarousel = async () => {
  const organizers = await getOrganizers(5);

  return (
    <section className="flex flex-col items-center justify-center">
      <PageHeader
        title="Organizacije"
        description="Pregled svih organizacija koje su deo naše zajednice."
      />

      <Carousel
        className="w-full"
        opts={{
          align: 'start',
        }}
      >
        <CarouselContent className="flex">
          {organizers.map(organizer => (
            <div
              key={organizer.userId}
              className="w-full flex-none p-4 transition-transform hover:scale-102 md:w-1/2 lg:w-1/3"
            >
              <OrganizerCard organizer={organizer} />
            </div>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <Button variant="link" className="mt-8" asChild>
        <Link href={'/organizations'}>
          Pogledaj sve organizacije <ArrowRightIcon />
        </Link>
      </Button>
    </section>
  );
};

export default OrganizationsCarousel;
