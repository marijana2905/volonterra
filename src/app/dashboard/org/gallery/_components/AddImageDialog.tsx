'use client';

import { useState } from 'react';

import { MAX_ORGANIZER_GALLERY_IMAGE_SIZE_MB, MAX_ORGANIZER_GALLERY_IMAGES } from '@/lib/constants';

import ClientSideUploader from './ClientSideUploader';

import CustomDialog from '@/components/global/CustomDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { PlusIcon } from 'lucide-react';

type AddImageDialogProps = {
  numOfImages: number;
};

const AddImageDialog = ({ numOfImages }: AddImageDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenDialog = () => {
    if (numOfImages >= MAX_ORGANIZER_GALLERY_IMAGES) {
      toast.error('Dostigli ste maksimalan broj fotografija u galeriji.');
      return;
    }

    setIsOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Badge variant={'outline'}>
          {numOfImages}/{MAX_ORGANIZER_GALLERY_IMAGES}
        </Badge>

        <Button onClick={handleOpenDialog}>
          <PlusIcon /> Dodaj fotografije
        </Button>
      </div>

      <CustomDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title="Dodaj fotografije"
        description="Ovde možete dodati nove fotografije u vašu galeriju."
        className="sm:max-w-3xl"
      >
        <ClientSideUploader
          numOfImages={numOfImages}
          maxImages={MAX_ORGANIZER_GALLERY_IMAGES}
          maxFileSizeMB={MAX_ORGANIZER_GALLERY_IMAGE_SIZE_MB}
          setIsModalOpen={setIsOpen}
        />
      </CustomDialog>
    </>
  );
};

export default AddImageDialog;
