'use client';

import { blobToBase64 } from '@/lib/utils';
import { uploadAvatar } from '@/actions/cloudinary/uploadAvatar';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeftIcon,
  CircleUserRoundIcon,
  Edit2Icon,
  Loader2Icon,
  SaveIcon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from 'lucide-react';

import { useFileUpload } from '@/hooks/use-file-upload';
import { Button } from '@/components/ui/button';
import {
  Cropper,
  CropperCropArea,
  CropperDescription,
  CropperImage,
} from '@/components/ui/cropper';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { BarLoader } from 'react-spinners';

// Define type for pixel crop area
type Area = { x: number; y: number; width: number; height: number };

// Helper function to create a cropped image blob
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', error => reject(error));
    image.setAttribute('crossOrigin', 'anonymous'); // Needed for canvas Tainted check
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  outputWidth: number = pixelCrop.width, // Optional: specify output size
  outputHeight: number = pixelCrop.height
): Promise<Blob | null> {
  try {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return null;
    }

    // Set canvas size to desired output size
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    // Draw the cropped image onto the canvas
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      outputWidth, // Draw onto the output size
      outputHeight
    );

    // Convert canvas to blob
    return new Promise(resolve => {
      canvas.toBlob(blob => {
        resolve(blob);
      }, 'image/jpeg'); // Specify format and quality if needed
    });
  } catch (error) {
    console.error('Error in getCroppedImg:', error);
    return null;
  }
}

type Props = {
  initialUrl?: string;
  username: string;
  // Optional avatar diameter in pixels; if omitted, defaults to current sizes
  size?: number;
  teamId?: string | null;
};

const AvatarUploaderWithCropper = ({ initialUrl, username, size, teamId }: Props) => {
  const [
    { files, isDragging },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({
    accept: 'image/*',
  });

  const previewUrl = files[0]?.preview || null;
  const fileId = files[0]?.id;

  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(initialUrl || null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sizes derived from custom avatar size (if provided)
  const editBtnPx = size ? Math.max(24, Math.round(size * 0.33)) : null; // ~33% of avatar
  const editIconPx = editBtnPx ? Math.max(12, Math.round(editBtnPx * 0.45)) : null; // ~45% of button

  // Ref to track the previous file ID to detect new uploads
  const previousFileIdRef = useRef<string | undefined | null>(null);

  // State to store the desired crop area in pixels
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // State for zoom level
  const [zoom, setZoom] = useState(1);

  // Callback for Cropper to provide crop data - Wrap with useCallback
  const handleCropChange = useCallback((pixels: Area | null) => {
    setCroppedAreaPixels(pixels);
  }, []);

  // Loading state for uploading action
  const [isLoading, setIsLoading] = useState(false);

  // On Apply button click upload to cloudinary!
  const handleApply = async () => {
    setIsLoading(true);

    // Check if we have the necessary data
    if (!previewUrl || !fileId || !croppedAreaPixels) {
      console.error('Missing data for apply:', {
        previewUrl,
        fileId,
        croppedAreaPixels,
      });
      // Remove file if apply is clicked without crop data?
      if (fileId) {
        removeFile(fileId);
        setCroppedAreaPixels(null);
      }
      return;
    }

    try {
      // 1. Get the cropped image blob using the helper
      const croppedBlob = await getCroppedImg(previewUrl, croppedAreaPixels);

      if (!croppedBlob) {
        throw new Error('Greška prilikom kreiranja avatara.');
      }

      // 1.1. Kreiraj base64 string iz blob-a (jer blob radi samo kroz lokalno kroz browser a za server action treba base64)
      // 1.2. Upload base64 slike na Cloudinary
      const fileName = `${username}_avatar`;
      const base64Image = await blobToBase64(croppedBlob);
      const { error } = await uploadAvatar(base64Image, fileName, teamId);
      if (error) {
        toast.error(error);
        setIsDialogOpen(false);
        return;
      }

      // 2. Create a NEW object URL from the cropped blob
      const newFinalUrl = URL.createObjectURL(croppedBlob);

      // 3. Revoke the OLD finalImageUrl if it exists
      if (finalImageUrl) {
        URL.revokeObjectURL(finalImageUrl);
      }

      // 4. Set the final avatar state to the NEW URL
      setFinalImageUrl(newFinalUrl);

      toast.success('Avatar uspešno sačuvan!');
    } catch (error) {
      console.error('Greška:', error);
      toast.error('Greška prilikom kreiranja avatara. Pokušajte ponovo.');
    } finally {
      setIsDialogOpen(false);
      setIsLoading(false);
    }
  };

  const handleRemoveFinalImage = () => {
    if (finalImageUrl) {
      URL.revokeObjectURL(finalImageUrl);
    }
    setFinalImageUrl(null);
  };

  useEffect(() => {
    const currentFinalUrl = finalImageUrl;
    // Cleanup function
    return () => {
      if (currentFinalUrl && currentFinalUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentFinalUrl);
      }
    };
  }, [finalImageUrl]);

  // Effect to open dialog when a *new* file is ready
  useEffect(() => {
    // Check if fileId exists and is different from the previous one
    if (fileId && fileId !== previousFileIdRef.current) {
      setIsDialogOpen(true); // Open dialog for the new file
      setCroppedAreaPixels(null); // Reset crop area for the new file
      setZoom(1); // Reset zoom for the new file
    }
    // Update the ref to the current fileId for the next render
    previousFileIdRef.current = fileId;
  }, [fileId]); // Depend only on fileId

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative inline-flex">
        {/* Drop area - uses finalImageUrl */}
        <button
          className={`border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 focus-visible:border-ring focus-visible:ring-ring/50 relative flex items-center justify-center overflow-hidden rounded-full border border-dashed transition-colors outline-none focus-visible:ring-[3px] has-disabled:pointer-events-none has-disabled:opacity-50 has-[img]:border-none ${
            size ? '' : 'size-24 md:size-32'
          }`}
          onClick={openFileDialog}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          aria-label={finalImageUrl ? 'Change image' : 'Upload image'}
          style={size ? { width: size, height: size } : undefined}
        >
          {finalImageUrl ? (
            <img
              className="size-full object-cover"
              src={finalImageUrl}
              alt="User avatar"
              style={{ objectFit: 'cover' }}
            />
          ) : (
            <div aria-hidden="true">
              <CircleUserRoundIcon className="size-4 opacity-60" />
            </div>
          )}
        </button>
        {/* Remove button - depends on finalImageUrl */}
        {finalImageUrl && (
          <Button
            onClick={openFileDialog}
            size="icon"
            className={`border-background focus-visible:border-background absolute rounded-full border-2 shadow-none ${
              size ? '' : '-top-1 -right-1 size-8 md:size-10'
            }`}
            aria-label="Change image"
            style={
              size
                ? {
                    width: editBtnPx ?? undefined,
                    height: editBtnPx ?? undefined,
                    top: 0,
                    right: 0,
                    transform: 'translate(50%, -50%)',
                  }
                : undefined
            }
          >
            {size ? (
              <Edit2Icon size={editIconPx ?? 16} />
            ) : (
              <Edit2Icon className="size-3.5 md:size-4.5" />
            )}
          </Button>
        )}
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload image file"
          tabIndex={-1}
        />
      </div>

      {/* Cropper Dialog - Use isDialogOpen for open prop */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="gap-0 p-0 sm:max-w-140 *:[button]:hidden">
          <DialogDescription className="sr-only">Crop image dialog</DialogDescription>
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="relative flex items-center justify-between border-b p-4 text-base">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="-my-1 opacity-60"
                  onClick={() => setIsDialogOpen(false)}
                  aria-label="Cancel"
                >
                  <ArrowLeftIcon aria-hidden="true" />
                </Button>
                <span>Isecite sliku</span>
              </div>
              <Button
                className="-my-1"
                onClick={handleApply}
                disabled={!previewUrl || isLoading}
                autoFocus
              >
                <SaveIcon />
                Sačuvaj
              </Button>
              <div className="absolute right-0 bottom-0 w-full">
                <BarLoader width="100%" color="green" loading={isLoading} />
              </div>
            </DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <Cropper
              className="h-96 sm:h-120"
              image={previewUrl}
              zoom={zoom}
              onCropChange={handleCropChange}
              onZoomChange={setZoom}
            >
              <CropperDescription />
              <CropperImage />
              <CropperCropArea className="rounded-full" />
            </Cropper>
          )}
          <DialogFooter className="border-t px-4 py-6">
            <div className="mx-auto flex w-full max-w-80 items-center gap-4">
              <ZoomOutIcon className="shrink-0 opacity-60" size={16} aria-hidden="true" />
              <Slider
                defaultValue={[1]}
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={value => setZoom(value[0] ?? 1)}
                aria-label="Zoom slider"
              />
              <ZoomInIcon className="shrink-0 opacity-60" size={16} aria-hidden="true" />
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvatarUploaderWithCropper;
