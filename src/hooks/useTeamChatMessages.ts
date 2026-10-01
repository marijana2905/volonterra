import { useInfiniteQuery } from '@tanstack/react-query';

export interface TeamChatMessage {
  id: string;
  name: string;
  text: string;
  time: string; // ISO string
}

interface MessagesResponse {
  messages: TeamChatMessage[];
  nextCursor: string | null; // ISO timestamp for pagination
}

async function fetchMessages(teamId: string, cursor?: string | null): Promise<MessagesResponse> {
  const url = new URL('/api/team-messages', window.location.origin);
  url.searchParams.set('teamId', teamId);
  if (cursor) url.searchParams.set('cursor', cursor);

  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) throw new Error('Greška pri učitavanju poruka');
  return res.json();
}

export function useTeamChatMessages(teamId: string | undefined | null) {
  return useInfiniteQuery<MessagesResponse, Error>({
    queryKey: ['team-messages', teamId],
    enabled: !!teamId,
    initialPageParam: null as string | null,
    getNextPageParam: lastPage => lastPage.nextCursor,
    queryFn: ({ pageParam }) =>
      fetchMessages(teamId as string, pageParam as string | null | undefined),
    refetchOnWindowFocus: false,
  });
}
