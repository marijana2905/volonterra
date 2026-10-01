'use client';

import React, { useMemo, useState } from 'react';

import { cn, formatDateTime } from '@/lib/utils';
import { useSession } from '@/lib/auth-client';

import { QuestionWithMessages } from '@/types/question.type';

import ReplyQuestionForm from './ReplyQuestionForm';

import MyAvatar from '@/components/global/MyAvatar';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { ChevronUpIcon } from 'lucide-react';
import QuestionCardDropdown from './QuestionCardDropdown';
import Link from 'next/link';

type QuestionCardProps = {
  question: QuestionWithMessages;
};

const QuestionCard = ({ question }: QuestionCardProps) => {
  const session = useSession();
  const currentUserId = session.data?.user?.id;

  const displayName = useMemo(() => {
    return question.user?.name ?? question.email ?? 'Anonimni korisnik';
  }, [question]);

  const avatarFallback = useMemo(() => {
    const source = question.user?.name ?? question.email ?? 'A';

    return source.charAt(0).toUpperCase();
  }, [question]);

  const createdAtFormatted = useMemo(() => {
    return formatDateTime(new Date(question.createdAt));
  }, [question.createdAt]);

  const sortedMessages = useMemo(() => {
    return [...(question.messages ?? [])].sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [question.messages]);

  const [showAllReplies, setShowAllReplies] = useState(false);

  const visibleReplies = useMemo(() => {
    if (showAllReplies) {
      return sortedMessages;
    }

    return sortedMessages.slice(0, 2);
  }, [showAllReplies, sortedMessages]);

  const hasHiddenReplies = sortedMessages.length > 2;
  const hiddenRepliesCount = Math.max(sortedMessages.length - visibleReplies.length, 0);
  const isConversationClosed = question.closed;

  return (
    <div className="flex flex-col gap-4">
      <Card className={cn(isConversationClosed && 'border-l-destructive border-l-4')}>
        <CardHeader className="flex items-center justify-between gap-4">
          <Link href={`/volunteers/${question.user?.username}`} className="group flex gap-4">
            <MyAvatar
              imageUrl={question.user?.image}
              fallbackText={avatarFallback}
              className="h-12 w-12"
            />
            <div className="flex flex-col">
              <span className="group-hover:text-primary text-base leading-tight font-semibold transition-colors">
                {displayName}
              </span>
              <span className="text-muted-foreground text-sm">{createdAtFormatted}</span>
            </div>
          </Link>

          {currentUserId === question.organizerUserId && (
            <QuestionCardDropdown questionId={question.id} isConversationEnded={question.closed} />
          )}
        </CardHeader>

        <CardContent>
          <p className="text-sm whitespace-pre-wrap md:text-base">{question.title}</p>

          {sortedMessages.length > 0 && (
            <div className="mt-4 flex flex-col">
              <span className="text-muted-foreground mb-4 flex items-center gap-1 font-semibold">
                Odgovori ({sortedMessages.length})
              </span>

              {visibleReplies.map(reply => {
                const replyCreatedAt = formatDateTime(new Date(reply.createdAt));
                const senderDisplayName = reply.senderUser?.name || 'Anonimni korisnik';
                const senderImageUrl = reply.senderUser?.image || null;
                let profileLink = '#';

                if (reply.senderUser?.role === 'ORGANIZER') {
                  profileLink = `/organizations/${reply.senderUser.username}`;
                } else {
                  profileLink = `/volunteers/${reply.senderUser?.username}`;
                }

                return (
                  <div
                    key={reply.id}
                    className="border-border/70 bg-background rounded-md border p-4 transition-colors"
                  >
                    <Link
                      href={profileLink}
                      className="group text-foreground/90 mb-2 flex items-center gap-2 text-sm"
                    >
                      <MyAvatar
                        imageUrl={senderImageUrl}
                        fallbackText={senderDisplayName?.charAt(0).toUpperCase() || 'Anon'}
                        className="size-8"
                      />
                      <div className="flex flex-col">
                        <span className="group-hover:text-primary transition-colors">
                          {senderDisplayName}
                        </span>
                        <span className="text-muted-foreground text-xs">{replyCreatedAt}</span>
                      </div>
                    </Link>

                    <p className="text-foreground/90 text-sm leading-relaxed whitespace-pre-wrap">
                      {reply.content}
                    </p>
                  </div>
                );
              })}

              {hasHiddenReplies && (
                <div className="mt-4 flex w-full items-center justify-center md:justify-start">
                  <Button
                    variant="ghost"
                    className="w-full md:w-fit"
                    onClick={() => setShowAllReplies(prev => !prev)}
                  >
                    {showAllReplies ? 'Prikaži manje' : `Vidi više (+${hiddenRepliesCount})`}

                    {showAllReplies && <ChevronUpIcon />}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="w-full border-t">
          {isConversationClosed ? (
            <Badge variant="destructive">Razgovor završen</Badge>
          ) : (
            <ReplyQuestionForm questionId={question.id} />
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuestionCard;
