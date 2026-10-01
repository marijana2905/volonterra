'use client';

import Image from 'next/image';

import { useFileUpload } from '@/hooks/use-file-upload';
import { addImagesToGallery } from '@/actions/organizer/addImagesToGallery.action';

import { AlertCircleIcon, ImageIcon, Loader2Icon, PlusIcon, UploadIcon, XIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import AlertCard from '@/components/global/AlertCard';
import { toast } from 'sonner';

type ClientSideUploaderProps = {
  numOfImages: number;
  maxImages: number;
  maxFileSizeMB: number;
  setIsModalOpen: (isOpen: boolean) => void;
};

const ClientSideUploader = ({
  numOfImages,
  maxImages,
  maxFileSizeMB,
  setIsModalOpen,
}: ClientSideUploaderProps) => {
  const remainingFiles = maxImages - numOfImages; // Broj slika koje korisnik još može da doda

  const maxFiles = remainingFiles;
  const maxSizeMB = maxFileSizeMB;
  const maxSize = maxSizeMB * 1024 * 1024;

  if (remainingFiles <= 0) {
    return <AlertCard variant="warning" title="Dostigli ste maksimalan broj slika u galeriji." />;
  }

  const [
    { files, isDragging, isUploading, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
      handleUploadFiles,
    },
  ] = useFileUpload({
    accept: 'image/svg+xml,image/png,image/jpeg,image/jpg,image/gif',
    maxSize,
    multiple: true,
    maxFiles,
    onUploadComplete: async results => {
      const { error } = await addImagesToGallery(results.map(result => result.url));

      if (error) {
        toast.error(error);
      } else {
        toast.success('Fotografije su uspešno dodate u galeriju.');
        setIsModalOpen(false);
      }
    },
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Drop area */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        data-files={files.length > 0 || undefined}
        className="border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors not-data-[files]:justify-center has-[input:focus]:ring-[3px]"
      >
        <input {...getInputProps()} className="sr-only" aria-label="Otpremi sliku" />
        {files.length > 0 ? (
          <div className="flex w-full flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="truncate text-sm font-medium">Za otpremanje: ({files.length})</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={openFileDialog}
                disabled={files.length >= maxFiles}
              >
                <PlusIcon className="-ms-0.5 size-3.5 opacity-60" aria-hidden="true" />
                Dodaj još
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {files.map(file => (
                <div key={file.id}>
                  <div className="bg-accent relative aspect-square rounded-md">
                    <Image
                      src={file.preview || ''}
                      alt={file.file.name}
                      fill
                      className="rounded-[inherit] object-cover"
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <Button
                      onClick={() => removeFile(file.id)}
                      size="icon"
                      className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none"
                      aria-label="Ukloni sliku"
                    >
                      <XIcon className="size-3.5" />
                    </Button>
                  </div>
                  <div className="w-full py-2">
                    <div className="bg-muted h-2 rounded">
                      <div
                        className={`h-2 rounded transition-all duration-300 ${file.uploaded ? 'bg-green-500' : 'bg-blue-500'}`}
                        style={{ width: `${file.percentage || 0}%` }}
                      />
                    </div>
                    <div className="text-muted-foreground mt-0.5 flex justify-between px-0.5 text-[10px]">
                      <span>{file.percentage ? `${file.percentage}%` : '0%'}</span>
                      {file.uploaded && <span className="text-green-600">Gotovo</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end">
              <Button className="w-fit" disabled={isUploading} onClick={handleUploadFiles}>
                {isUploading ? <Loader2Icon className="animate-spin" /> : <UploadIcon />}
                Otpremi
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
            <div
              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <ImageIcon className="size-4 opacity-60" />
            </div>
            <p className="mb-1.5 text-sm font-medium">Prevucite slike ovde</p>
            <p className="text-muted-foreground text-xs">
              JPG, PNG, SVG ili GIF (maks. {maxSizeMB}MB)
            </p>
            <Button variant="outline" className="mt-4" onClick={openFileDialog}>
              <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
              Izaberi slike
            </Button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div className="text-destructive flex items-center gap-1 text-xs" role="alert">
          <AlertCircleIcon className="size-3 shrink-0" />
          <span>{errors[0]}</span>
        </div>
      )}
    </div>
  );
};

export default ClientSideUploader;
