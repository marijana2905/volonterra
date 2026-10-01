'use client';

import { useState } from 'react';
import Link from 'next/link';

import { formatDate, formatRelativeTime } from '@/lib/utils';

import CommentsList from './CommentsList';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronDown, Reply } from 'lucide-react';
import { CommentWithAuthor } from '@/types/blog.type';
import MyAvatar from '@/components/global/MyAvatar';
import CommentForm from './CommentForm';
import CommentDropdown from './CommentDropdown';
import { isSameDate } from '@/lib/utils';

type Props = {
  userId?: string;
  postId: string;
  comment: CommentWithAuthor;
  commentsByParentId: Record<string, CommentWithAuthor[]>;
};

const CommentCard = ({ userId, postId, comment, commentsByParentId }: Props) => {
  const childComments = commentsByParentId[comment.id] || [];

  const [isReplyFormOpen, setIsReplyFormOpen] = useState(false);
  const [isRepliesVisible, setIsRepliesVisible] = useState(false);
  const [isRepliesHovered, setIsRepliesHovered] = useState(false);

  const authorLink = `${comment.author?.role === 'VOLUNTEER' ? '/volunteers/' : '/organizations/'}${comment.author?.username}`;

  const isEdited = new Date(comment.createdAt).getTime() !== new Date(comment.updatedAt).getTime();

  const toggleReplyForm = () => {
    setIsReplyFormOpen(prev => !prev);
  };

  const toggleReplies = () => {
    setIsRepliesVisible(prev => !prev);
  };

  return (
    <>
      <Card className="gap-4 py-4 shadow-none">
        <CardHeader className="text-muted-foreground text-sm">
          <CardTitle className="flex items-center gap-2">
            <Link href={authorLink} className="group flex cursor-pointer items-center gap-2">
              <MyAvatar
                imageUrl={comment.author?.image || '/default_avatar.svg'}
                fallbackText={comment.author?.name ? comment.author.name.charAt(0) : ''}
                className="size-9"
              />

              <div className="flex flex-col gap-1 font-normal">
                <span className="group-hover:text-primary transition-colors">
                  {comment.author?.name}
                </span>
                <span className="text-xs">{formatRelativeTime(comment.createdAt)}</span>
              </div>
            </Link>

            {userId && userId === comment.author?.id && (
              <div className="ml-auto">
                <CommentDropdown postId={postId} comment={comment} />
              </div>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p>{comment.content}</p>
          {isEdited && (
            <span className="text-muted-foreground text-xs">
              (Izmenjeno {formatRelativeTime(comment.updatedAt)})
            </span>
          )}
        </CardContent>

        <CardFooter className="flex items-start justify-between gap-2">
          {/* Show/Hide replies button */}
          {childComments.length > 0 && (
            <Button
              variant="link"
              className="text-muted-foreground text-xs"
              size={'sm'}
              onMouseEnter={() => setIsRepliesHovered(true)}
              onMouseLeave={() => setIsRepliesHovered(false)}
              onClick={toggleReplies}
              type="button"
            >
              {isRepliesVisible ? 'Sakrij odgovore' : `Prikaži odgovore (${childComments.length})`}

              {isRepliesVisible && <ChevronDown size={15} />}
            </Button>
          )}

          {userId && (
            <Button variant={'outline'} onClick={toggleReplyForm} size="sm" className="ml-auto">
              <Reply />
              Odgovori
              {isReplyFormOpen && <ChevronDown />}
            </Button>
          )}
        </CardFooter>
      </Card>

      {(isRepliesVisible || isReplyFormOpen) && (
        <div className="flex">
          <div
            className={`inline-block w-px ${isRepliesHovered ? 'bg-primary' : 'bg-border'} transition-colors`}
            onClick={toggleReplies}
            onMouseEnter={() => setIsRepliesHovered(true)}
            onMouseLeave={() => setIsRepliesHovered(false)}
          />

          <div className="flex w-full flex-col gap-2">
            {isReplyFormOpen && (
              <div className="mb-2 ml-4">
                <CommentForm
                  postId={postId}
                  parentId={comment.id}
                  autoFocus={true}
                  onSubmitHandle={() => {
                    setIsRepliesVisible(true);
                    setIsReplyFormOpen(false);
                  }}
                  onCancelHandle={() => {
                    setIsReplyFormOpen(false);
                  }}
                />
              </div>
            )}

            {childComments.length > 0 && isRepliesVisible && (
              <div className="ml-4 flex-1">
                <CommentsList
                  userId={userId}
                  postId={postId}
                  comments={childComments}
                  commentsByParentId={commentsByParentId}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CommentCard;
