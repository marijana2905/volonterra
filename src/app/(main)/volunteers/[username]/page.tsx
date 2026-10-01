import ContentWrapper from '@/components/global/ContentWrapper';
import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import MyAvatar from '@/components/global/MyAvatar';
import NotFound from './not-found';

import { getVolunteersInfo } from '@/data/volunteer/getVolunteersInfo';
import VolunteerInfo from '../_components/VolunteerInfo';
import VolunteerActionsCarousel from '../_components/VolunteerActionCarousel';
import { Badge } from '@/components/ui/badge';
import { badgeNames } from '@/lib/utils';
import { AwardIcon, CoinsIcon } from 'lucide-react';


export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return { title: `Volonter @${username}` };
}

const VolunteerProfilePage = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;

  const volunteer = await getVolunteersInfo(username);
  if (!volunteer) return <NotFound />;

  return (
    <ContentWrapper className="flex flex-col">
      <BreadcrumbWrapper
        homeHref="/"
        items={[{ label: 'Volonteri', href: '/volunteers' }, { label: volunteer.fullName }]}
      />

      <section className="flex flex-col items-center justify-center p-8 text-center">
        <MyAvatar
          imageUrl={volunteer.image || ''}
          fallbackText={volunteer.fullName}
          className="size-32"
        />

        <div className="flex items-center gap-2">
          <Badge className="my-4">
            <AwardIcon />
            {badgeNames[volunteer.badgeLevel - 1]}
          </Badge>
          <Badge variant={'outline'}>
            <CoinsIcon />
            {volunteer.workedHours}
          </Badge>
        </div>

        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{volunteer.fullName}</h1>
        <span className="text-muted-foreground">{volunteer.email}</span>
      </section>

      <VolunteerInfo volunteer={volunteer} />
      <VolunteerActionsCarousel volunteerId={volunteer.userId} />
    </ContentWrapper>
  );
};

export default VolunteerProfilePage;
