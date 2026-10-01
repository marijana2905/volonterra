'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

import { Team } from '@prisma/types';
import { useSession } from '@/lib/auth-client';
import { useTeamChatMessages } from '@/hooks/useTeamChatMessages';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SendIcon, LoaderCircle, Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { TeamWithMembers } from '@/types/team.type';
import MembersList from './MembersList';
import Link from 'next/link';

type Message = {
  name: string;
  text: string;
  time: string;
};

type Props = {
  selectedTeam: TeamWithMembers | null;
};

const TeamChat = ({ selectedTeam }: Props) => {
  const session = useSession();
  const user = session.data?.user;
  const username = user?.username;

  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Track user scroll state & team change for initial autoscroll
  const atBottomRef = useRef(true);
  const teamChangedRef = useRef(false);

  // Live (socket) messages appended after loaded history
  const [liveMessages, setLiveMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [activity, setActivity] = useState<string | null>(null);

  const teamId = selectedTeam?.id;
  const {
    data: pages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status: messagesStatus,
  } = useTeamChatMessages(teamId);

  const historyMessages = useMemo(() => {
    if (!pages) return [] as Message[];
    // We want the newest messages at the bottom. The API returns pages where first page is newest (assumption).
    // When we fetchNextPage (older messages), we prepend them visually. Reverse pages array so older pages (fetched later) go to top.
    const ordered = [...pages.pages].reverse();
    return ordered.flatMap((page) => page.messages) as Message[];
  }, [pages]);

  const messages = useMemo(
    () => [...historyMessages, ...liveMessages],
    [historyMessages, liveMessages],
  );

  useEffect(() => {
    if (selectedTeam === null || !user) return;

    let isMounted = true;

    const connectSocket = async () => {
      const socket = io(process.env.NEXT_PUBLIC_EXPRESS_URL!, {
        auth: {
          userId: user.id,
        },
        reconnectionAttempts: 3,
      });
      socketRef.current = socket;

      socket.on('message', (msg: Message) => {
        setLiveMessages((prev) => [...prev, msg]);
      });

      socket.on('activity', (name: string) => {
        if (name === username) return;
        setActivity(`${name} kuca...`);
        setTimeout(() => setActivity(null), 1500);
      });

      socket.on('connect_error', (err) => {
        toast.error(`Greška pri povezivanju: ${err.message}`);
      });
    };

    connectSocket();

    return () => {
      isMounted = false;
      socketRef.current?.disconnect();
    };
  }, [selectedTeam, user]);

  useEffect(() => {
    if (!selectedTeam || !username || !socketRef.current || !user?.id) return;

    socketRef.current.emit('enterRoom', {
      userId: user.id,
      name: username,
      room: selectedTeam.id,
    });

    setLiveMessages([]); // reset live
    teamChangedRef.current = true; // ensure initial scroll to bottom after first load
  }, [selectedTeam, username, user?.id]);

  // After history changes (e.g., initial load or switching team) scroll to bottom only once per team change.
  useEffect(() => {
    if (!scrollRef.current) return;
    if (teamChangedRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      atBottomRef.current = true;
      teamChangedRef.current = false;
    }
  }, [historyMessages.length]);

  // When new live messages arrive, auto scroll only if user is already at bottom.
  useEffect(() => {
    if (!scrollRef.current) return;
    if (atBottomRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [liveMessages.length]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Determine if user is near bottom (used for live message autoscroll)
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    atBottomRef.current = distanceFromBottom < 40;

    if (!hasNextPage || isFetchingNextPage) return;
    if (el.scrollTop < 40) {
      // Preserve scroll position after adding older messages.
      const prevHeight = el.scrollHeight;
      fetchNextPage().then(() => {
        // After React Query adds new (older) messages at top, adjust scroll so content doesn't jump.
        requestAnimationFrame(() => {
          const newHeight = el.scrollHeight;
          const heightDiff = newHeight - prevHeight;
          // Maintain viewport relative position.
          el.scrollTop = el.scrollTop + heightDiff;
        });
      });
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !username || !messageText.trim() || !user?.id) return;
    setActivity(null);

    socketRef.current?.emit('message', {
      name: username,
      text: messageText,
    });

    setMessageText('');
  };

  const handleTyping = () => {
    if (!selectedTeam || !username) return;
    socketRef.current?.emit('activity', username);
  };

  if (session.isPending) return null;

  const initialLoading = messagesStatus === 'pending' && selectedTeam;
  return (
    <Card className="bg-background flex h-[calc(100vh-9.3rem)] min-h-0 w-full flex-col gap-0 overflow-hidden border shadow-none lg:w-3/5">
      <CardHeader className="flex flex-shrink-0 items-center justify-between gap-2 border-b">
        <CardTitle className="text-lg">{selectedTeam?.name ?? '—'}</CardTitle>
        {selectedTeam && <MembersList team={selectedTeam} />}
      </CardHeader>

      <CardContent className="min-h-0 flex-1 p-0">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="bg-muted/30 flex h-full min-h-0 flex-col gap-3 overflow-y-auto p-6"
        >
          {selectedTeam === null ? (
            <div className="text-muted-foreground mx-auto text-center text-sm">
              Odaberite tim da biste počeli razgovor.
            </div>
          ) : (
            <>
              {initialLoading && (
                <div className="flex w-full justify-center">
                  <Loader2Icon className="animate-spin" />
                </div>
              )}
              {isFetchingNextPage && !initialLoading && (
                <div
                  className="text-muted-foreground flex w-full justify-center py-2 text-[10px]"
                  aria-live="polite"
                >
                  <LoaderCircle className="mr-1 h-3 w-3 animate-spin" /> Učitavanje ranijih
                  poruka...
                </div>
              )}
              {messages.map((msg, i) => {
                const isOwn = msg.name === username;
                const isAdmin = msg.name === 'Admin';

                if (isAdmin) {
                  return (
                    <div key={i} className="flex w-full justify-center">
                      <div className="bg-muted text-muted-foreground inline-flex max-w-[80%] items-center justify-center rounded-full px-3 py-1 text-xs font-medium">
                        {msg.text}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={i} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={
                        'max-w-[75%] rounded-2xl px-4 py-2 text-sm ' +
                        (isOwn
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-background rounded-bl-sm border')
                      }
                    >
                      {!isOwn && (
                        <Link
                          href={`/volunteers/${msg.name}`}
                          className="text-muted-foreground hover:text-primary mb-1 cursor-pointer text-xs font-semibold"
                        >
                          {msg.name}
                        </Link>
                      )}
                      <div className="leading-relaxed break-words whitespace-pre-wrap">
                        {msg.text}
                      </div>
                      <div
                        className={
                          'mt-1 text-right text-[10px] ' +
                          (isOwn ? 'text-primary-foreground/80' : 'text-muted-foreground')
                        }
                      >
                        {(() => {
                          const t = msg.time;
                          if (!t) return '';
                          const d = new Date(t);
                          if (Number.isNaN(d.getTime())) return t;

                          const locale = 'sr-Latn';
                          const tz = 'Europe/Belgrade';
                          const time = d.toLocaleTimeString(locale, {
                            timeZone: tz,
                            hour: '2-digit',
                            minute: '2-digit',
                          });

                          const today = new Date();
                          const sameDay =
                            d.toLocaleDateString(locale, { timeZone: tz }) ===
                            today.toLocaleDateString(locale, { timeZone: tz });

                          if (sameDay) {
                            return time;
                          }

                          const longDate = d.toLocaleDateString(locale, {
                            timeZone: tz,
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          });

                          return `${longDate} ${time}`;
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex-shrink-0 border-t pt-2">
        <div className="flex w-full flex-col gap-2">
          {activity && (
            <div className="text-muted-foreground text-xs" role="status" aria-live="polite">
              {activity}
            </div>
          )}
          <form className="flex w-full items-center gap-2" onSubmit={sendMessage}>
            <Input
              placeholder="Poruka..."
              className="flex-1"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleTyping}
              disabled={!selectedTeam}
              aria-label="Unesi poruku"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!messageText.trim() || !selectedTeam}
              aria-label="Pošalji"
            >
              <SendIcon className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TeamChat;
