'use client';

import React from 'react';
import Image from 'next/image';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { badgeNames } from '@/lib/utils';

type VolunteerBadgesProps = {
  badgeLevel: number;
};

const VolunteerBadges = ({ badgeLevel }: VolunteerBadgesProps) => {
  const badgeSlots = Array.from({ length: 6 });

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {badgeSlots.map((_, idx) => (
        <Tooltip key={idx}>
          <TooltipTrigger>
            <Image
              src={`/badges/Bedz_${idx + 1}.png`}
              alt={`Badge ${idx + 1}`}
              width={128}
              height={128}
              className={idx + 1 <= badgeLevel ? '' : 'opacity-30'}
            />
          </TooltipTrigger>
          <TooltipContent>{badgeNames[idx]}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

export default VolunteerBadges;
