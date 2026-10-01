'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';

import { CalendarDays, ClockIcon, MapPinIcon, Tag, UsersIcon } from 'lucide-react';

import { formatDate, getTimeFromDate, isSameDate } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActionWithOrganizerAndCategories } from '@/types/action.type';
import MyAvatar from '../global/MyAvatar';

type ActionCardProps = {
  action: ActionWithOrganizerAndCategories;
  showOrganizer?: boolean;
};

export const ActionCard = ({ action, showOrganizer = true }: ActionCardProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const {
    title,
    city,
    address,
    fullDateFrom,
    fullDateTo,
    bannerImage,
    categories = [],
    organizer,
    maxParticipants,
    participants,
    slug,
  } = action;

  const organizerName = organizer.organizationName;

  const startTime = fullDateFrom ? getTimeFromDate(fullDateFrom) : '';
  const endTime = fullDateTo ? getTimeFromDate(fullDateTo) : '';

  const bannerSrc = bannerImage
    ? bannerImage
    : !mounted
      ? '/auth_image.webp'
      : theme === 'dark'
        ? '/auth_image_dark.webp'
        : '/auth_image.webp';

  const displayedCategories = categories.slice(0, 2);
  const remainingCount = categories.length - displayedCategories.length;

  const sameDay = isSameDate(fullDateFrom, fullDateTo);

  return (
    <Link href={`/actions/${slug}`} className="flex-grow">
      <Card className="group relative flex h-full flex-col gap-6 overflow-hidden p-0 transition-all duration-300">
        <div className="relative h-72 overflow-hidden">
          <Image
            src={bannerSrc}
            alt={title}
            width={500}
            height={350}
            className="h-full object-cover transition-transform duration-400 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />

          {!!categories.length && (
            <div className="absolute top-6 left-6 flex flex-wrap items-center gap-2">
              {displayedCategories.map(cat => (
                <Badge key={cat.slug} variant="secondary" className="backdrop-blur-sm">
                  <Tag className="h-3 w-3" /> {cat.name}
                </Badge>
              ))}
              {remainingCount > 0 && (
                <Badge variant="secondary" className="backdrop-blur-sm">
                  +{remainingCount}
                </Badge>
              )}
            </div>
          )}

          <div className="absolute bottom-6 left-6">
            <Badge variant="secondary" className="backdrop-blur-sm">
              <UsersIcon size={16} /> {participants}/{maxParticipants}
            </Badge>
          </div>
        </div>

        <CardHeader className="flex-1 text-left">
          <CardTitle className="group-hover:text-primary text-xl transition-colors">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-2 px-6 pb-6 text-sm">
          {showOrganizer && (
            <div className="flex items-center gap-2">
              <span className="text-primary/80">
                <MyAvatar
                  imageUrl={action.organizer.image}
                  fallbackText={organizerName}
                  className="size-6"
                />
              </span>
              <span>{organizerName}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-primary/80">{<MapPinIcon />}</span>
            <span>
              {address}, {city}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary/80">{<CalendarDays />}</span>
            <span>
              {sameDay
                ? formatDate(fullDateFrom)
                : `${formatDate(fullDateFrom)} – ${formatDate(fullDateTo)}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary/80">{<ClockIcon />}</span>
            <span>{sameDay ? startTime : `${startTime} – ${endTime}`}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
