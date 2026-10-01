import { cache } from 'react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const requireAdmin = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/auth/login');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard/');
  }

  return session;
});
