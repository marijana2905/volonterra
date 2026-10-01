import Link from 'next/link';

import { OrganizerListItem } from '@/types/organizer.type';

import MyAvatar from '@/components/global/MyAvatar';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { ArrowRightIcon, HeartIcon } from 'lucide-react';
import { getUserSession } from '@/data/auth/getUserSession';

type OrganizerCardProps = {
  organizer: OrganizerListItem;
};

const OrganizerCard = async ({ organizer }: OrganizerCardProps) => {
  const session = await getUserSession();
  const isLiked = Boolean(
    session?.user && organizer.likes?.some(like => like.userId === session.user!.id)
  );

  return (
    <Link href={`/organizations/${organizer.username}`} className="block h-full">
      <Card className="group relative flex h-full items-center justify-center">
        <CardContent className="flex flex-1 flex-col items-center text-center">
          <MyAvatar
            imageUrl={organizer.image}
            fallbackText={organizer.organizationName}
            className="border-border size-32 border"
          />
          <div className="mt-4 flex-1 space-y-1">
            <h3 className="group-hover:text-primary text-lg font-semibold tracking-tight transition-colors duration-200">
              {organizer.organizationName}
            </h3>
            <p className="text-muted-foreground text-sm">@{organizer.username}</p>
          </div>
        </CardContent>

        <CardFooter className="flex w-full items-center justify-between gap-2">
          <Button className="w-full cursor-pointer">
            Pogledaj profil <ArrowRightIcon />
          </Button>
        </CardFooter>

        <span className="absolute top-6 right-6 flex items-center gap-1">
          <HeartIcon className={`${isLiked && 'fill-primary'} stroke-primary`} size={18} />
          <span className="text-primary">{organizer.likesCount}</span>
        </span>
      </Card>
    </Link>
  );
};

export default OrganizerCard;
