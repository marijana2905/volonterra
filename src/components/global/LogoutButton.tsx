'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { signOut } from '@/lib/auth-client';

import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Loader2Icon, LogOutIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export const LogoutDropdownItem = () => {
  const queryClient = useQueryClient();

  const router = useRouter();
  const handleClick = async () => {
    queryClient.clear();

    await signOut({
      fetchOptions: {
        onError: ctx => {
          toast.error('Došlo je do greške prilikom odjave.');
        },
        onSuccess: () => {
          toast.success('Uspešno ste se odjavili.');
          router.push('/auth/login');
        },
      },
    });
  };

  return (
    <DropdownMenuItem onClick={handleClick} className="group">
      <LogOutIcon className="group-hover:text-accent-foreground" />
      Odjavi se
    </DropdownMenuItem>
  );
};

type Props = {
  state: 'expanded' | 'collapsed';
  isMobile?: boolean;
};

export const LogoutButton = ({ state, isMobile }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    queryClient.clear();

    await signOut({
      fetchOptions: {
        onError: ctx => {
          toast.error('Došlo je do greške prilikom odjave.');
        },
        onSuccess: () => {
          toast.success('Uspešno ste se odjavili.');
          router.push('/auth/login');
        },
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
      },
    });
  };

  return (
    <Button onClick={handleClick} variant={'ghost'} disabled={isPending}>
      {isPending ? <Loader2Icon className="animate-spin" /> : <LogOutIcon />}
      {(state === 'expanded' || isMobile) && <span>Odjavi se</span>}
    </Button>
  );
};
