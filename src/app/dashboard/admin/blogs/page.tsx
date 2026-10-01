import { requireAdmin } from '@/data/auth/requireAdmin';
import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';

import AlertCard from '@/components/global/AlertCard';
import BannedBlogCard from './_components/BannedBlogCard';
import { getBannedBlogs } from '@/data/admin/getBannedBlogs';

const BannedBlogsPage = async () => {
  await requireAdmin();

  const blogs = await getBannedBlogs();

  return (
    <section className="flex flex-col gap-4 p-4">
      <BreadcrumbWrapper items={[{ label: 'Blogovi' }]} homeHref="/dashboard/admin/statistics" />

      {blogs.length === 0 ? (
        <div className="flex flex-col gap-4 md:px-8">
          <AlertCard
            title="Nema banovanih blogova"
            description="Trenutno nema blogova koji su označeni kao nepoželjni."
          />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 md:px-8">
          {blogs.map(blog => (
            <BannedBlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </section>
  );
};

export default BannedBlogsPage;
