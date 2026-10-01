import { requireAdmin } from '@/data/auth/requireAdmin';

import { getAllCategories } from '@/data/admin/getAllCategories';

import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import CategoriesList from './_components/CategoriesList';

const AdminCategoriesPage = async () => {
  await requireAdmin();

  const categories = await getAllCategories();

  return (
    <section className="flex flex-col gap-4 p-4">
      <BreadcrumbWrapper
        items={[{ label: 'Kategorije akcija' }]}
        homeHref="/dashboard/admin/categories"
      />

      <div className="flex flex-col gap-4 md:px-8">
        <CategoriesList categories={categories} />
      </div>
    </section>
  );
};

export default AdminCategoriesPage;
