'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

import useMediaQuery from '@/hooks/use-media-query';

import ImagePreviewDialog from '@/components/global/gallery/ImagePreviewDialog';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { Maximize2 } from 'lucide-react';

type GalleryProps = {
  images: string[];
};

const OrganizerGallery = ({ images }: GalleryProps) => {
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbnailApi, setThumbnailApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const hasImages = images.length > 0;

  const handleThumbnailClick = useCallback(
    (index: number) => {
      if (!hasImages) {
        return;
      }

      mainApi?.scrollTo(index);
      thumbnailApi?.scrollTo(index);
      setCurrent(index);
    },
    [hasImages, mainApi, thumbnailApi]
  );

  const openPreview = useCallback((url: string) => {
    setPreviewUrl(url);
    setIsPreviewOpen(true);
  }, []);

  const handleDialogChange = useCallback((open: boolean) => {
    setIsPreviewOpen(open);
    if (!open) {
      setPreviewUrl(null);
    }
  }, []);

  const mainSlides = useMemo(
    () =>
      images.map((image, index) => (
        <CarouselItem key={index} className="flex items-center justify-center">
          <div className="group relative flex min-h-[70vh] w-full items-center justify-center">
            <Image
              fill
              src={image}
              alt={`Glavna fotografija ${index + 1}`}
              className="object-contain"
              sizes="100vw"
              priority={index === 0}
            />

            <div className="absolute right-6 bottom-6 flex items-center gap-2 transition-opacity duration-300 group-hover:opacity-100 lg:opacity-0">
              <Button
                size="sm"
                variant="secondary"
                type="button"
                onClick={() => openPreview(image)}
                className="gap-2 bg-black/70 text-white backdrop-blur hover:bg-black/80"
              >
                <Maximize2 className="size-4" />
                Uvećaj
              </Button>
            </div>
          </div>
        </CarouselItem>
      )),
    [images, openPreview]
  );

  const thumbnailSize = isDesktop ? 96 : 80;

  const thumbnailSlides = useMemo(
    () =>
      images.map((image, index) => (
        <CarouselItem
          key={index}
          className="flex"
          style={{
            flex: `0 0 ${thumbnailSize}px`,
            width: `${thumbnailSize}px`,
            height: `${thumbnailSize}px`,
          }}
        >
          <button
            type="button"
            onClick={() => handleThumbnailClick(index)}
            className={cn(
              'group focus-visible:ring-primary relative flex h-full w-full items-center justify-center overflow-hidden rounded border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              index === current
                ? 'border-primary bg-primary/10'
                : 'border-border/40 bg-background/70 hover:border-primary/60 hover:bg-primary/5'
            )}
            aria-label={`Prikaži fotografiju ${index + 1}`}
            aria-current={index === current}
          >
            <Image
              fill
              src={image}
              alt={`Sličica ${index + 1}`}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes={isDesktop ? '140px' : '20vw'}
            />
          </button>
        </CarouselItem>
      )),
    [current, handleThumbnailClick, images, thumbnailSize]
  );

  useEffect(() => {
    if (!mainApi || !thumbnailApi) {
      return;
    }

    const handleMainSelect = () => {
      const selected = mainApi.selectedScrollSnap();
      setCurrent(selected);
      thumbnailApi.scrollTo(selected);
    };

    const handleThumbnailSelect = () => {
      const selected = thumbnailApi.selectedScrollSnap();
      setCurrent(selected);
      mainApi.scrollTo(selected);
    };

    mainApi.on('select', handleMainSelect);
    thumbnailApi.on('select', handleThumbnailSelect);

    return () => {
      mainApi.off('select', handleMainSelect);
      thumbnailApi.off('select', handleThumbnailSelect);
    };
  }, [mainApi, thumbnailApi]);

  useEffect(() => {
    if (!hasImages) {
      setCurrent(0);
      return;
    }

    mainApi?.scrollTo(0);
    thumbnailApi?.scrollTo(0);
    setCurrent(0);
  }, [hasImages, mainApi, thumbnailApi]);

  const thumbnailOrientation = isDesktop ? 'vertical' : 'horizontal';

  if (!hasImages) {
    return (
      <div className="text-muted-foreground flex w-full items-center justify-center rounded-xl border p-12 text-center">
        Organizator još uvek nije dodao fotografije.
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border p-4 shadow">
      <div className="flex w-full flex-col gap-6 lg:h-[70vh] lg:flex-row">
        <div className="order-2 w-full lg:order-1 lg:w-56 lg:pr-4">
          <Carousel
            setApi={setThumbnailApi}
            orientation={thumbnailOrientation}
            opts={{ align: 'start', dragFree: true, containScroll: 'trimSnaps' }}
            className={cn('w-full', isDesktop ? 'h-full' : '')}
          >
            <CarouselContent className={cn('gap-2', isDesktop ? 'mt-0' : 'ml-0')}>
              {thumbnailSlides}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="order-1 flex-1 lg:order-2">
          <Carousel
            setApi={setMainApi}
            opts={{ align: 'start', loop: true }}
            className="relative h-full w-full"
          >
            <CarouselContent className="ml-0 h-full lg:ml-0">{mainSlides}</CarouselContent>
            <CarouselPrevious className="top-1/2 left-4 -translate-y-1/2" />
            <CarouselNext className="top-1/2 right-4 -translate-y-1/2" />
          </Carousel>
        </div>
      </div>

      <ImagePreviewDialog
        open={isPreviewOpen}
        imageUrl={previewUrl}
        onOpenChange={handleDialogChange}
      />
    </div>
  );
};

export default OrganizerGallery;
