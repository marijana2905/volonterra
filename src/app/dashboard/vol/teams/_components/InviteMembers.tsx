'use client';

import { useCallback, useMemo, useState } from 'react';
import { CheckIcon, UserRoundPlusIcon, XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { VolunteerListItem } from '@/types/volunteer.type';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { BarLoader } from 'react-spinners';
import { sendInvitationAction } from '@/actions/team/sendInvitation.action';
import { toast } from 'sonner';

type Props = {
  teamId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const InviteMembers = ({ teamId, isOpen, setIsOpen }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: volunteers,
    isLoading: isLoadingVolunteers,
    isError: isErrorVolunteers,
  } = useQuery({
    queryKey: ['volunteers', teamId],
    queryFn: async () => {
      const response = await fetch('/api/volunteer/all');
      if (!response.ok) {
        throw new Error('Failed to fetch volunteers');
      }
      const data = await response.json();
      return data as VolunteerListItem[];
    },
  });

  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = useCallback(
    (userId: string) => {
      setSelected(prev =>
        prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
      );
    },
    [setSelected]
  );

  const clearAll = useCallback(() => setSelected([]), []);

  const filtered = useMemo(() => {
    const list = volunteers ?? [];
    if (!query.trim()) return list;
    const q = query.toLowerCase().trim();
    return list.filter(
      v =>
        v.fullName.toLowerCase().includes(q) ||
        v.username.toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q)
    );
  }, [volunteers, query]);

  const selectedItems = useMemo(() => {
    const map = new Map((volunteers ?? []).map(v => [v.userId, v] as const));
    return selected.map(id => map.get(id)).filter(Boolean) as VolunteerListItem[];
  }, [selected, volunteers]);

  const handleSend = useCallback(async () => {
    if (!selected.length) return;
    setIsSubmitting(true);

    const result = await sendInvitationAction(teamId, selected);

    if (result.error) {
      toast.error(result.error);
    } else if (result.success) {
      toast.success(`Broj uspešno poslatih pozivnica: ${result.invitedCount}`);
    }

    setIsOpen(false);
    setIsSubmitting(false);
  }, [selected, setIsOpen]);

  const getInitials = (name: string) => {
    const parts = name.split(' ').filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
    return (first + last).toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="flex max-h-[min(640px,80vh)] flex-col gap-0 p-0 sm:max-w-2xl"
        showCloseButton={false}
      >
        <ScrollArea className="flex max-h-full flex-col overflow-hidden">
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="flex items-center justify-between px-6 py-6">
              Dodaj nove članove
              <XIcon
                onClick={() => setIsOpen(false)}
                size={20}
                className="hover:text-primary transition-colors"
              />
            </DialogTitle>

            <Separator />

            <DialogDescription asChild>
              <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center gap-3">
                  <Input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Pretraga volontera (ime, username, e-mail)"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-md border">
                    <div className="flex items-center justify-between border-b px-3 py-2">
                      <p className="text-sm font-medium">Volonteri</p>
                      <span className="text-muted-foreground text-xs">
                        {(filtered ?? []).length}
                      </span>
                    </div>
                    <div className="max-h-72 overflow-auto p-2">
                      {isLoadingVolunteers && (
                        <div className="flex flex-col gap-2">
                          {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-3 rounded-md p-2">
                              <Skeleton className="size-8 rounded-full" />
                              <div className="flex flex-1 flex-col gap-1">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-24" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {isErrorVolunteers && !isLoadingVolunteers && (
                        <p className="text-muted-foreground text-sm">
                          Došlo je do greške pri učitavanju liste volontera.
                        </p>
                      )}
                      {!isLoadingVolunteers && !isErrorVolunteers && filtered.length === 0 && (
                        <p className="text-muted-foreground px-2 py-4 text-sm">Nema rezultata.</p>
                      )}

                      {!isLoadingVolunteers && !isErrorVolunteers && filtered.length > 0 && (
                        <ul className="flex flex-col gap-1">
                          {filtered.map(v => {
                            const isSelected = selected.includes(v.userId);
                            return (
                              <li key={v.userId}>
                                <button
                                  type="button"
                                  onClick={() => toggleSelect(v.userId)}
                                  className={cn(
                                    'hover:bg-accent group flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors',
                                    isSelected && 'bg-accent'
                                  )}
                                >
                                  <Avatar>
                                    <AvatarImage src={v.image} alt={v.fullName} />
                                    <AvatarFallback>{getInitials(v.fullName)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex min-w-0 flex-1 flex-col">
                                    <span className="truncate text-sm font-medium">
                                      {v.fullName}
                                    </span>
                                    <span className="text-muted-foreground truncate text-xs">
                                      @{v.username}
                                    </span>
                                  </div>
                                  <div className="text-muted-foreground ml-auto">
                                    {isSelected ? (
                                      <CheckIcon className="text-primary" size={16} />
                                    ) : (
                                      <UserRoundPlusIcon size={16} />
                                    )}
                                  </div>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <div className="flex items-center justify-between border-b px-3 py-2">
                      <p className="text-sm font-medium">Izabrani</p>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-xs">{selected.length}</span>
                        {selected.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={clearAll}
                          >
                            Ukloni sve
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-72 overflow-auto p-2">
                      {selected.length === 0 ? (
                        <p className="text-muted-foreground px-2 py-4 text-sm">
                          Niste izabrali nijednog volontera.
                        </p>
                      ) : (
                        <ul className="flex flex-col gap-1">
                          {selectedItems.map(v => (
                            <li key={v.userId} className="flex items-center gap-3 rounded-md p-2">
                              <Avatar>
                                <AvatarImage src={v.image} alt={v.fullName} />
                                <AvatarFallback>{getInitials(v.fullName)}</AvatarFallback>
                              </Avatar>
                              <div className="flex min-w-0 flex-1 flex-col">
                                <span className="truncate text-sm font-medium">{v.fullName}</span>
                                <span className="text-muted-foreground truncate text-xs">
                                  @{v.username}
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="hover:text-destructive"
                                onClick={() => toggleSelect(v.userId)}
                                aria-label={`Ukloni ${v.fullName}`}
                              >
                                <XIcon size={16} />
                              </Button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Odustani
                  </Button>
                  <Button onClick={handleSend} disabled={selected.length === 0 || isSubmitting}>
                    Pošalji
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div className="absolute top-0 left-0 w-full">
            <BarLoader color="green" width={'100%'} loading={isSubmitting} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMembers;
