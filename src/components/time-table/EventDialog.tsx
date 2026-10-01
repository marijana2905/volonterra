'use client';

import { CalendarEvent } from './types';
import { canEditAction, formatDateTime, getTimeFromDate, isSameDate } from '@/lib/utils';

import ButtonLink from '@/components/global/ButtonLink';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  Users,
  Calendar as CalendarIcon,
  Info,
  UsersIcon,
  Edit3Icon,
  XIcon,
  ExternalLink,
  ListCheckIcon,
  CheckIcon,
} from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ParticipationType, UserRole } from '@prisma/types';

interface EventDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDialog({ event, isOpen, onClose }: EventDialogProps) {
  if (!event) return null;

  // Mapiranje boja statusa na Tailwind klase
  const colorMap: Record<string, string> = {
    sky: 'bg-sky-500',
    amber: 'bg-amber-500',
    violet: 'bg-violet-500',
    rose: 'bg-rose-500',
    emerald: 'bg-emerald-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
  };

  const getBadge = (type: ParticipationType) => {
    switch (type) {
      case ParticipationType.INDIVIDUAL:
        return <Badge variant="outline">Individualna prijava</Badge>;
      case ParticipationType.TEAM:
        return <Badge variant="outline">Timska prijava</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${colorMap[event.color]}`} />
              <DialogTitle>{event.title}</DialogTitle>
            </div>

            <Button size={'icon'} variant={'ghost'} onClick={onClose}>
              <XIcon />
            </Button>
          </div>
        </DialogHeader>

        <Separator className="mb-2" />

        <div>
          <div className="flex flex-col gap-4 py-2">
            {event.participationType && (
              <div>
                <div className="text-muted-foreground mb-1 flex items-center gap-2 text-sm">
                  <CheckIcon className="h-4 w-4" /> Tip prijave
                </div>
                {getBadge(event.participationType)}
              </div>
            )}
            <div>
              <div className="text-muted-foreground mb-1 flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4" /> Datum i vreme
              </div>
              <p className="text-sm">
                {isSameDate(event.start, event.end)
                  ? `${formatDateTime(event.start)} - ${getTimeFromDate(event.end)}`
                  : `${formatDateTime(event.start)} - ${formatDateTime(event.end)}`}
              </p>
            </div>

            {event.location && (
              <div>
                <div className="text-muted-foreground mb-1 flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" /> Lokacija
                </div>
                <p className="text-sm">{event.location}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <UsersIcon className="h-4 w-4" /> Učesnici
          </div>

          {(event.minParticipants || event.maxParticipants || event.participants) && (
            <div className="flex w-full items-center justify-start gap-4">
              {typeof event.participants === 'number' && (
                <Badge variant="default">Trenutno: {event.participants}</Badge>
              )}
              {typeof event.minParticipants === 'number' && (
                <Badge variant="outline">Potrebno: {event.minParticipants}</Badge>
              )}
              {typeof event.maxParticipants === 'number' && (
                <Badge variant="outline">Maksimum: {event.maxParticipants}</Badge>
              )}
            </div>
          )}
        </div>

        <Separator className="mt-4 mb-2" />

        <DialogFooter>
          <div className="flex w-full justify-start gap-2">
            <ButtonLink
              href={`/actions/${event.slug}`}
              label="Detaljnije"
              variant={'secondary'}
              icon={ExternalLink}
            />
            {event.role === UserRole.ORGANIZER && canEditAction(event.start, event.status) && (
              <ButtonLink
                href={`/dashboard/org/actions/${event.slug}`}
                label="Izmeni"
                variant={'secondary'}
                icon={Edit3Icon}
              />
            )}

            {event.role === UserRole.VOLUNTEER && (
              <ButtonLink
                href={`/dashboard/vol/actions/`}
                label="Vidi prijave"
                variant={'secondary'}
                icon={ListCheckIcon}
              />
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
