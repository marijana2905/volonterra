import Link from 'next/link';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import MyAvatar from '@/components/global/MyAvatar';
import { ArrowRight, CoinsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Volunteer } from '@prisma/types';
import { Badge } from '@/components/ui/badge';

type Props = {
  volunteer: Volunteer;
};

export const VolunteerCard = ({ volunteer }: Props) => {
  const { fullName, username, image } = volunteer;
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <Link href={`/volunteers/${username}`} className="group">
      <Card className="relative">
        <CardContent className="flex flex-1 flex-col items-center justify-center text-center">
          <MyAvatar imageUrl={image || null} fallbackText={initials} className="size-32" />

          <div className="mt-4">
            <p className="text-foreground group-hover:text-primary text-lg font-semibold transition-colors">
              {fullName}
            </p>
            <p className="text-muted-foreground text-sm">@{username}</p>
          </div>
        </CardContent>

        <CardFooter>
          <Button className="w-full">
            Pogledaj profil <ArrowRight />
          </Button>
        </CardFooter>

        <Badge variant={'outline'} className="absolute top-6 right-6">
          <CoinsIcon />
          {volunteer.workedHours}
        </Badge>
      </Card>
    </Link>
  );
};

export default VolunteerCard;
