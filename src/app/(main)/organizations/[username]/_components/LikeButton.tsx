'use client';

import React, { useEffect, useState } from 'react';

import { useSession } from '@/lib/auth-client';

import { OrganizerProfile } from '@/types/organizer.type';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

import { Heart } from 'lucide-react';
import { toggleLikeForOrganizer } from '@/actions/organizer/toggleLike.action';
import { toast } from 'sonner';

type Props = {
  organizer: OrganizerProfile;
  isLikedByCurrentUser?: boolean;
  readonly: boolean;
};

const LikeButton = ({ organizer, isLikedByCurrentUser, readonly }: Props) => {
  const session = useSession();
  const isPending = session.isPending;
  const isLoggedIn = Boolean(session.data);
  const liked = Boolean(isLikedByCurrentUser);

  const canInteract = isLoggedIn && !readonly && !isPending;

  const [isLiking, setIsLiking] = useState(false);
  const [optimisticLiked, setOptimisticLiked] = useState(liked);
  const [optimisticCount, setOptimisticCount] = useState(organizer.likesCount);

  // Keep local state in sync when server revalidates and props update
  useEffect(() => {
    setOptimisticLiked(liked);
    setOptimisticCount(organizer.likesCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liked, organizer.likesCount]);

  const handleClick = async () => {
    if (!canInteract) return;

    setIsLiking(true);

    // optimistic toggle
    const nextLiked = !optimisticLiked;
    setOptimisticLiked(nextLiked);
    setOptimisticCount(c => c + (nextLiked ? 1 : -1));

    const { error } = await toggleLikeForOrganizer(organizer.username);

    if (error) {
      // revert on error and show toast
      setOptimisticLiked(!nextLiked);
      setOptimisticCount(c => c + (nextLiked ? -1 : 1));
      toast.error(error);
    }

    setIsLiking(false);
  };

  const HeartIcon = (
    <Heart
      size={18}
      className={
        optimisticLiked ? 'fill-primary stroke-primary' : 'stroke-current transition-colors'
      }
      aria-hidden="true"
    />
  );

  if (!canInteract) {
    return (
      <Button type="button" variant="ghost" className={'transition-transform active:scale-95'}>
        {HeartIcon}
        <span
          className={`transition-colors ${liked ? 'text-primary' : 'group-hover:text-primary'}`}
        >
          {organizer.likesCount}
        </span>
      </Button>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className={'transition-transform active:scale-95'}
          onClick={handleClick}
          disabled={isLiking}
          aria-pressed={optimisticLiked}
        >
          {HeartIcon}

          <span
            className={`transition-colors ${optimisticLiked ? 'text-primary' : 'group-hover:text-primary'}`}
          >
            {optimisticCount}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        {optimisticLiked ? 'Skloni lajk' : 'Lajkuj organizatora'}
      </TooltipContent>
    </Tooltip>
  );
};

export default LikeButton;
