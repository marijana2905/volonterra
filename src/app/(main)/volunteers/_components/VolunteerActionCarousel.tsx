import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ActionCard } from '@/components/hero/FeaturedActionsCard';
import { getVolunteerActionsForPublicPage } from '@/data/volunteer/getVolunteerActionsForPublicPage';

type VolunteerActionsCarouselProps = {
  volunteerId: string;
};

const VolunteerActionsCarousel = async ({ volunteerId }: VolunteerActionsCarouselProps) => {
  const actions = await getVolunteerActionsForPublicPage(volunteerId);

  return (
    <section className="mt-12 flex w-full flex-col items-center justify-center">
      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold">Akcije na kojima je učestvovao</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Pregled volonterskih akcija u kojima je učestvovao.
        </p>
      </div>

      {actions.length == 0 ? (
        <p className="text-muted-foreground text-center text-base">
          Ovaj volonter trenutno nije učestvovao ni na jednoj akciji.
        </p>
      ) : (
        <Carousel
          className="w-full"
          opts={{
            align: 'start',
          }}
        >
          <CarouselContent className="flex gap-4 px-8">
            {actions.map(({ action }) => (
              <CarouselItem
                key={action.id}
                className="w-full flex-none p-2 transition-transform hover:scale-102 md:w-1/2 lg:w-1/3"
              >
                <ActionCard action={action} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </section>
  );
};

export default VolunteerActionsCarousel;
