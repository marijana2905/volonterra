import { redirect } from 'next/navigation';
import { requireSession } from '@/data/auth/requireSession';

const DashboardPage = async () => {
  const session = await requireSession();
  if (session.user.role === 'ADMIN') redirect('/dashboard/admin/statistics');
  else if (session.user.role === 'ORGANIZER') redirect('/dashboard/org/statistics');
  else redirect('/dashboard/vol/statistics');
};

export default DashboardPage;
