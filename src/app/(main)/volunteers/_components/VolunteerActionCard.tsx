'use client';

import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRightIcon, MapPinIcon } from 'lucide-react';
import { Action } from '@prisma/types';

type VolunteerActionCardProps = {
  action: Action;
};

const VolunteerActionCard = ({ action }: VolunteerActionCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="flex-1 border-b">
        <CardTitle className="text-lg font-semibold">{action.title}</CardTitle>
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-4 w-4" /> {action.city}, {action.address}
        </div>
      </CardHeader>

      <CardFooter className="flex justify-end">
        <Button size="sm" variant="default" asChild>
          <Link href={`/actions/${action.slug}`} passHref>
            Vidi više <ArrowRightIcon />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VolunteerActionCard;
