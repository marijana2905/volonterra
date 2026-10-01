import MyAvatar from '@/components/global/MyAvatar';
import StarRating from '@/components/global/StarRating';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { ActionImpressionType } from '@/types/action.type';
import { CalendarIcon } from 'lucide-react';
import React from 'react';
import ImpressionCardDropdown from './ImpressionCardDropdown';
import Link from 'next/link';

type Props = {
  impression: ActionImpressionType;
  canUserEdit: boolean;
};

const ImpressionCard = ({ impression, canUserEdit }: Props) => {
  const author = impression.user;

  const created = new Date(impression.createdAt);
  const updated = new Date(impression.updatedAt);
  const isEdited = created.getTime() !== updated.getTime();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col items-start justify-between gap-4 md:flex-row">
          <Link
            href={`/volunteers/${author.username}`}
            className="group flex w-full items-start justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <MyAvatar
                imageUrl={author?.image}
                fallbackText={author?.name ? author.name.trim().charAt(0).toUpperCase() : ''}
                className="size-10 md:size-12"
              />
              <div className="flex flex-col gap-1 font-normal">
                <span className="group-hover:text-primary text-sm font-semibold transition-colors md:text-base">
                  {author?.name}
                </span>
                <span className="text-sm">{formatDate(impression.createdAt)}</span>
              </div>
            </div>

            {canUserEdit && (
              <div className="md:hidden">
                <ImpressionCardDropdown impression={impression} />
              </div>
            )}
          </Link>

          <div className="flex items-center gap-8">
            <StarRating value={impression.rating} readOnly size={24} />

            {canUserEdit && (
              <div className="hidden md:block">
                <ImpressionCardDropdown impression={impression} />
              </div>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="minimal-tiptap-content">
          <div dangerouslySetInnerHTML={{ __html: impression.comment }} />
        </div>
        {isEdited && <CardDescription className="mt-2">(Izmenjeno)</CardDescription>}
      </CardContent>
    </Card>
  );
};

export default ImpressionCard;
