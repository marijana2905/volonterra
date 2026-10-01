'use client';

import Link from 'next/link';

import { useSession } from '@/lib/auth-client';

import { Button } from '@/components/ui/button';

import { ArrowRight } from 'lucide-react';

const GetStartedButton = () => {
  const session = useSession();

  if (session.isPending) {
    return (
      <Button size="lg" className="group" asChild>
        <Link href="#">
          Pridruži se
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    );
  }

  return (
    <>
      {session.data ? (
        <Button size="lg" className="group" asChild>
          <Link href="/actions">
            Vidi akcije
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      ) : (
        <Button size="lg" className="group" asChild>
          <Link href="/auth/register">
            Pridruži se
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      )}
    </>
  );
};

export default GetStartedButton;
