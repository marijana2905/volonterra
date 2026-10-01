'use client';

import { useCallback, useState } from 'react';

import YesNoAlertDialog from '@/components/global/YesNoAlertDialog';

import { toast } from 'sonner';
import GalleryImageTile from '@/components/global/gallery/GalleryImageTile';
import ImagePreviewDialog from '@/components/global/gallery/ImagePreviewDialog';
import { deleteImageFromGallery } from '@/actions/organizer/deleteImageFromGallery.action';

type GalleryGridProps = {
  urls: string[];
};

const GalleryGrid = ({ urls }: GalleryGridProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!imageToDelete) return;

    const { error } = await deleteImageFromGallery(imageToDelete);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Fotografija je uspešno obrisana iz galerije.');
      setImageToDelete(null);
    }
  }, [imageToDelete]);

  const handlePreview = useCallback((url: string) => {
    setPreviewUrl(url);
  }, []);

  const handleDialogChange = useCallback((open: boolean) => {
    if (!open) {
      setPreviewUrl(null);
    }
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {urls.map((url, index) => (
          <div key={`${url}-${index}`} className="relative rounded-xl">
            <div className="overflow-hidden rounded-xl">
              <GalleryImageTile
                url={url}
                onPreview={() => handlePreview(url)}
                onDelete={() => {
                  setImageToDelete(url);
                  setIsDeleteDialogOpen(true);
                }}
              />
            </div>

            {imageToDelete === url && (
              <div className="bg-destructive/70 pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl">
                <span className="font-semibold text-white">Označeno za brisanje</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <ImagePreviewDialog
        open={Boolean(previewUrl)}
        imageUrl={previewUrl}
        onOpenChange={handleDialogChange}
      />

      <YesNoAlertDialog
        variant="error"
        title="Obriši fotografiju"
        description="Da li ste sigurni da želite obrisati ovu fotografiju? Ova akcija je nepovratna."
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        onCancel={() => setImageToDelete(null)}
        confirmText="Da, obriši"
        loadingText="Brisanje..."
      />
    </>
  );
};

export default GalleryGrid;
