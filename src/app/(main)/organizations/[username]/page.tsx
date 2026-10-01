import { getOrganizerProfile } from '@/data/organizer/getOrganizerProfile';
import { getActionsForOrganizer } from '@/data/action/getActionForOrganizer';
import { isOrganizerLikedByUser } from '@/data/organizer/isOrganizerLikedByUser';

import NotFound from './not-found';

import ContentWrapper from '@/components/global/ContentWrapper';
import MyAvatar from '@/components/global/MyAvatar';

import OrganizerTabs from './_components/OrganizerTabs';
import OrganizerGallery from './_components/OrganizerGallery';
import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import OrganizersFeaturedActions from './_components/OrganizerFeaturedActions';
import LikeButton from './_components/LikeButton';
import { getUserSession } from '@/data/auth/getUserSession';

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  return {
    title: `Organizator @${username}`,
  };
}

const OrganizerDetailsPage = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params;

  const [organizer, isLikedByCurrentUser, session] = await Promise.all([
    getOrganizerProfile(username),
    isOrganizerLikedByUser(username),
    getUserSession(),
  ]);

  if (!organizer) {
    return NotFound();
  }

  const { recentAction, mostParticipantsAction } = await getActionsForOrganizer(organizer.userId);

  return (
    <ContentWrapper className="flex flex-col">
      <BreadcrumbWrapper
        homeHref="/"
        items={[
          { label: 'Organizacije', href: '/organizations' },
          { label: organizer.organizationName },
        ]}
      />

      <section className="flex flex-col items-center justify-center p-8 text-center">
        <MyAvatar
          imageUrl={organizer.image}
          fallbackText={organizer.organizationName}
          className="size-32"
        />

        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          {organizer.organizationName}
        </h1>

        <span className="my-4 flex items-center gap-4">
          <span>{organizer.email}</span>

          <LikeButton
            organizer={organizer}
            isLikedByCurrentUser={isLikedByCurrentUser}
            readonly={!session || session.user.id === organizer.userId}
          />
        </span>
      </section>

      <OrganizerTabs organizer={organizer} />

      <OrganizerGallery images={organizer.galleryImages} />

      <OrganizersFeaturedActions
        recentAction={recentAction}
        mostParticipantsAction={mostParticipantsAction}
        organizerUsername={organizer.username}
      />
    </ContentWrapper>
  );
};

export default OrganizerDetailsPage;
