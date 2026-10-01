import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import { getAllVolunteersForAdmin } from '@/data/volunteer/getAllVolunteersForAdmin';
import { requireAdmin } from '@/data/auth/requireAdmin';
import VolunteersTable from '../_components/VolunteersTable';

const AdminVolunteersPage = async () => {
  await requireAdmin();

  const volunteers = await getAllVolunteersForAdmin();

  const formattedVolunteers = volunteers.map(v => ({
    id: v.userId,
    name: v.fullName,
    username: v.username,
    email: v.email,
    image: v.image ?? null,
    isBanned: v.user.banned ?? null,
    banExpires: v.user.banExpires ?? null,
    banReason: v.user.banReason ?? null,
    role: 'volunteer' as const,
  }));

  return (
    <section className="flex flex-col gap-4 p-4">
      <BreadcrumbWrapper items={[{ label: 'Volonteri' }]} homeHref="/dashboard/admin/statistics" />

      <div className="flex flex-col gap-4 md:px-8">
        <VolunteersTable users={formattedVolunteers} firstColumnHeader="Volonter" />
      </div>
    </section>
  );
};

export default AdminVolunteersPage;
