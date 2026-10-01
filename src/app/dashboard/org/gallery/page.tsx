import { getOrganizerGallery } from '@/data/organizer/getOrganizerGallery';
import { requireOrganizer } from '@/data/auth/requireOrganizer';

import AlertCard from '@/components/global/AlertCard';
import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';

import AddImageDialog from './_components/AddImageDialog';
import GalleryGrid from './_components/GalleryGrid';

const OrganizerGalleryPage = async () => {
  const session = await requireOrganizer();
  const imageUrls = await getOrganizerGallery(session.user.id);

  return (
    <section className="flex flex-col gap-4 p-4">
      <BreadcrumbWrapper items={[{ label: 'Galerija' }]} homeHref="/dashboard/org/statistics" />

      <div className="flex flex-col gap-4 md:px-8">
        <AddImageDialog numOfImages={imageUrls.length} />

        {imageUrls.length === 0 ? (
          <AlertCard title="Još uvek niste dodali nijednu fotografiju u galeriju." />
        ) : (
          <GalleryGrid urls={imageUrls} />
        )}
      </div>
    </section>
  );
};

export default OrganizerGalleryPage;
