'use client';

import Image from 'next/image';
import { Trash2Icon } from 'lucide-react';

import { cn } from '@/lib/utils';

type GalleryImageTileProps = {
  url: string;
  onPreview: () => void; // This fires when the image is clicked
  onDelete?: () => void; // This fires when the delete button is clicked
  className?: string;
};

const imageSizes = `
  (max-width: 640px) 100vw,
  (max-width: 1024px) 50vw,
  (max-width: 1280px) 33vw,
  (max-width: 1536px) 25vw,
  20vw
`;

const GalleryImageTile = ({ url, onPreview, onDelete, className }: GalleryImageTileProps) => {
  return (
    <div
      className={cn('group relative aspect-square overflow-hidden rounded-lg border', className)}
    >
      <button type="button" onClick={onPreview}>
        <Image
          fill
          src={url}
          alt="Fotografija iz galerije"
          sizes={imageSizes}
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </button>

      {onDelete && (
        <button
          type="button"
          onClick={event => {
            event.stopPropagation();
            onDelete?.();
          }}
          className="pointer-events-auto absolute top-2 right-2 z-10 flex items-center justify-center rounded-md bg-black/60 p-1 text-white opacity-100 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100"
        >
          <Trash2Icon className="size-6" />
        </button>
      )}
    </div>
  );
};

export default GalleryImageTile;
