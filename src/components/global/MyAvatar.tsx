import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Props = {
  imageUrl: string | null | undefined;
  fallbackText: string;
  className?: string;
};

const MyAvatar = ({ imageUrl, fallbackText, className }: Props) => {
  return (
    <Avatar className={`${className}`}>
      <AvatarImage src={imageUrl || '/default_avatar.svg'} />
      <AvatarFallback>{fallbackText.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};

export default MyAvatar;
