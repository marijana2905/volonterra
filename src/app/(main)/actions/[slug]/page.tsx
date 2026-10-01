import Link from 'next/link';
import { formatDateTime, getStatusBadge, getTimeFromDate, isSameDate } from '@/lib/utils';

import { getActionForDetailPage } from '@/data/action/getActionForDetailPage';

import ContentWrapper from '@/components/global/ContentWrapper';
import DynamicMap from '@/components/global/maps/DynamicMap';
import MyAvatar from '@/components/global/MyAvatar';
import NotFound from './not-found';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  MapPinIcon,
  UsersIcon,
  CalendarDays,
  ClockIcon,
  CalendarIcon,
  TagIcon,
} from 'lucide-react';
import ParticipationButtons from './_components/ParticipationButtons';
import ParticipantsList from './_components/ParticipantsList';
import ReadOnlyRangeCalendar from './_components/ReadOnlyRangeCalendar';
import ExpandableDescription from '@/components/global/ExpandableDescription';
import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import Impressions from './_components/impressions/Impressions';
import { ParticipationStatus } from '@prisma/types';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const action = await getActionForDetailPage(slug);

  if (!action) {
    return { title: 'Akcija nije pronađena' };
  }

  return {
    title: action.title,
    openGraph: {
      title: action.title,
    },
  };
}

const ActionDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const action = await getActionForDetailPage(slug);

  if (!action) {
    return <NotFound />;
  }

  const statusBadgeData = getStatusBadge(action.status, action.fullDateFrom, action.fullDateTo);
  const participantsIds = action.participations.map((p) => {
    if (p.status === ParticipationStatus.ATTENDED) {
      return p.user.id;
    }
  });

  return (
    <ContentWrapper className="flex flex-col gap-8">
      <BreadcrumbWrapper
        homeHref="/"
        items={[{ label: 'Akcije', href: '/actions' }, { label: action.title }]}
      />

      {/* Title + Status + Categories, Location, Participants Count */}
      <div className="flex flex-col items-center gap-4">
        <Badge className="text-xs" variant={statusBadgeData.variant}>
          {statusBadgeData.children}
        </Badge>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {action.categories.map((category) => (
            <Link href={`/actions?categorySlug=${category.slug}`} key={category.slug}>
              <Badge variant="secondary">
                <TagIcon /> {category.name}
              </Badge>
            </Link>
          ))}
        </div>

        <h1 className="text-center text-3xl font-bold tracking-tight md:text-5xl">
          {action.title}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <MapPinIcon size={20} /> {action.city}, {action.address}
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon size={20} /> {action.participants} / {action.maxParticipants}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        {/* Left side - description */}
        <Card>
          <CardHeader className="border-b">
            <Link
              href={`/organizations/${action.organizer.username}`}
              className="hover:text-primary flex cursor-pointer items-center gap-4 transition-colors"
            >
              <MyAvatar
                imageUrl={action.organizer.image}
                fallbackText={action.organizer.organizationName.charAt(0).toUpperCase()}
                className="size-12"
              />
              <span className="flex flex-col">
                <span>{action.organizer.organizationName}</span>
                <span className="text-muted-foreground">@{action.organizer.username}</span>
              </span>
            </Link>
          </CardHeader>
          <CardContent className="flex-1">
            <ExpandableDescription html={action.description} maxHeight={240} />
          </CardContent>

          {/* Buttons for participation (only for upcoming actions) */}
          {statusBadgeData.variant === 'upcoming' && (
            <CardFooter className="border-t">
              <ParticipationButtons actionId={action.id} />
            </CardFooter>
          )}
        </Card>

        {/* Right side - date and time */}
        <Card>
          <CardContent className="flex flex-1 flex-col items-start">
            <ReadOnlyRangeCalendar
              from={action.fullDateFrom}
              to={action.fullDateTo}
              className="w-full"
            />
          </CardContent>

          <CardFooter className="text-muted-foreground flex flex-col gap-2 border-t">
            {action.fullDateFrom && action.fullDateTo ? (
              isSameDate(action.fullDateFrom, action.fullDateTo) ? (
                // Ako su isti datumi — prikazujemo samo vreme od-do
                <div className="flex items-center gap-2">
                  <ClockIcon className="text-primary h-4 w-4" />
                  <span>
                    {getTimeFromDate(action.fullDateFrom)} - {getTimeFromDate(action.fullDateTo)}
                  </span>
                </div>
              ) : (
                // Ako su datumi različiti — prikazujemo svaki datum i vreme posebno
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="text-primary h-4 w-4" />
                    {formatDateTime(action.fullDateFrom)}
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="text-primary h-4 w-4" />
                    {formatDateTime(action.fullDateTo)}
                  </div>
                </div>
              )
            ) : (
              <span className="text-muted-foreground italic">Nema unetog datuma</span>
            )}
          </CardFooter>
        </Card>
      </div>

      {/* Map placeholder */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <MapPinIcon size={20} /> Lokacija
        </h2>
        <DynamicMap
          markers={[{ lat: action.latitude, lng: action.longitude }]}
          zoom={13}
          height="304px"
        />
      </div>

      {/* Participants list */}
      {action.status !== 'CANCELLED' && <ParticipantsList participants={action.participations} />}

      {/* Impressions section (only for completed actions) */}
      {action.status === 'COMPLETED' && (
        <Impressions
          impressions={action.impressions}
          participantsIds={participantsIds}
          actionId={action.id}
        />
      )}
    </ContentWrapper>
  );
};

export default ActionDetailPage;
