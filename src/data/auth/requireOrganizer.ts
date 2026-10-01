import { cache } from 'react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

// Ako korisnik nema sesiju preumeri ga na login stranicu
export const requireOrganizer = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/auth/login');
  }

  if (session.user.role !== 'ORGANIZER') {
    redirect('/dashboard/');
  }

  return session;
});
