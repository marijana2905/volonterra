'use client';

import Image from 'next/image';
import { XIcon } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type ImagePreviewDialogProps = {
  open: boolean;
  imageUrl: string | null;
  onOpenChange: (open: boolean) => void;
};

const ImagePreviewDialog = ({ open, imageUrl, onOpenChange }: ImagePreviewDialogProps) => {
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false} className="h-[90vh] p-0 pt-4 sm:max-w-3xl">
        <DialogHeader className="sr-only">
          <DialogTitle></DialogTitle>
        </DialogHeader>

        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="focus-visible:ring-primary focus-visible:ring-offset-background absolute top-4 right-4 z-10 rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden"
        >
          <XIcon className="size-5" />
        </button>

        <div className="flex h-full w-full items-center justify-center p-4">
          {imageUrl ? (
            <div className="relative h-full w-full">
              <Image
                fill
                src={imageUrl}
                alt={imageUrl}
                className="object-contain"
                sizes="100vw"
                priority={open}
              />
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">Fotografija nije dostupna.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewDialog;
