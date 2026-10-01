'use client';

import React from 'react';
import Link from 'next/link';

import { formatDate, getStatusBadge } from '@/lib/utils';

import { ActionWithOrganizerAndCategories } from '@/types/action.type';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, CalendarDays, Clock, UsersIcon } from 'lucide-react';

type Props = {
  action: ActionWithOrganizerAndCategories;
};

export const ActionCard = ({ action }: Props) => {
  const { title, city, address, fullDateFrom, fullDateTo, startTime, endTime, slug, status } =
    action;

  const statusBadge = getStatusBadge(status, new Date(fullDateFrom), new Date(fullDateTo));

  return (
    <Link href={`/actions/${slug}`} className="group">
      <Card>
        <CardHeader>
          <div className="flex justify-between gap-2">
            <Badge variant={statusBadge.variant}>{statusBadge.children}</Badge>

            <div className="flex items-center gap-1 text-sm">
              <UsersIcon size={16} />
              <span className="ml-1">
                {action.participants}/{action.maxParticipants}
              </span>
            </div>
          </div>
          {/* <Link href={`/organizations/${action.organizer.username}`} className="group flex gap-2">
          <MyAvatar imageUrl={action.organizer.image} fallbackText="logo" className="size-10" />
          <span>{action.organizer.organizationName}</span>
        </Link> */}
          <span className="group-hover:text-primary text-lg font-semibold transition-colors">
            {title}
          </span>
        </CardHeader>

        <CardContent className="flex flex-col gap-2 text-sm">
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {address}, {city}
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {(() => {
              const from = typeof fullDateFrom === 'string' ? new Date(fullDateFrom) : fullDateFrom;
              const to = typeof fullDateTo === 'string' ? new Date(fullDateTo) : fullDateTo;
              const sameDay =
                from.getFullYear() === to.getFullYear() &&
                from.getMonth() === to.getMonth() &&
                from.getDate() === to.getDate();
              return sameDay ? formatDate(from) : `${formatDate(from)} – ${formatDate(to)}`;
            })()}
          </p>

          <p className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {startTime} – {endTime}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ActionCard;
