import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import VolunteersTable from '../_components/VolunteersTable';
import { getAllOrganizersForAdmin } from '@/data/organizer/getAllOrganizersForAdmin';

const AdminOrganizersPage = async () => {
  const organizers = await getAllOrganizersForAdmin();

  const formattedOrganizers = organizers.map(o => ({
    id: o.userId,
    name: o.organizationName,
    username: o.username,
    email: o.email,
    image: o.image ?? null,
    isBanned: o.user.banned,
    banExpires: o.user.banExpires ?? null,
    banReason: o.user.banReason ?? null,
    role: 'organization' as const,
  }));

  return (
    <section className="flex flex-col gap-4 p-4">
      <BreadcrumbWrapper
        items={[{ label: 'Organizatori' }]}
        homeHref="/dashboard/admin/statistics"
      />

      <div className="flex flex-col gap-4 md:px-8">
        <VolunteersTable users={formattedOrganizers} firstColumnHeader="Organizacija" />
      </div>
    </section>
  );
};

export default AdminOrganizersPage;
