'use client';

import { addImagesToGallery } from '@/actions/organizer/addImagesToGallery.action';
import { useSession } from '@/lib/auth-client';
import axios from 'axios';
import type React from 'react';
import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
} from 'react';
import { toast } from 'sonner';

export type FileMetadata = {
  name: string;
  size: number;
  type: string;
  url: string;
  id: string;
};

export type FileWithPreview = {
  file: File | FileMetadata;
  id: string;
  preview?: string;
  percentage?: number; // Percentage of upload completion
  uploaded?: boolean; // Whether the file has been uploaded
};

export type CloudinaryUploadResponse = {
  id: string;
  url: string;
  assetId?: string;
};

export type FileUploadOptions = {
  maxFiles?: number; // Only used when multiple is true, defaults to Infinity
  maxSize?: number; // in bytes
  accept?: string;
  multiple?: boolean; // Defaults to false
  initialFiles?: FileMetadata[];
  onFilesChange?: (files: FileWithPreview[]) => void; // Callback when files change
  onFilesAdded?: (addedFiles: FileWithPreview[]) => void; // Callback when new files are added
  onUploadComplete?: (uploadedFiles: CloudinaryUploadResponse[]) => void; // Callback when upload completes
};

export type FileUploadState = {
  files: FileWithPreview[];
  isDragging: boolean;
  isUploading: boolean; // Indicates if files are currently being uploaded
  errors: string[];
};

export type FileUploadActions = {
  handleUploadFiles: () => void;
  addFiles: (files: FileList | File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  clearErrors: () => void;
  handleDragEnter: (e: DragEvent<HTMLElement>) => void;
  handleDragLeave: (e: DragEvent<HTMLElement>) => void;
  handleDragOver: (e: DragEvent<HTMLElement>) => void;
  handleDrop: (e: DragEvent<HTMLElement>) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  openFileDialog: () => void;
  getInputProps: (
    props?: InputHTMLAttributes<HTMLInputElement>
  ) => InputHTMLAttributes<HTMLInputElement> & {
    ref: React.Ref<HTMLInputElement>;
  };
};

export const useFileUpload = (
  options: FileUploadOptions = {}
): [FileUploadState, FileUploadActions] => {
  const {
    maxFiles = Infinity,
    maxSize = Infinity,
    accept = '*',
    multiple = false,
    initialFiles = [],
    onFilesChange,
    onFilesAdded,
    onUploadComplete,
  } = options;

  const session = useSession();

  const [state, setState] = useState<FileUploadState>({
    files: initialFiles.map(file => ({
      file,
      id: file.id,
      preview: file.url,
      percentage: 0,
      uploaded: false,
    })),
    isDragging: false,
    isUploading: false,
    errors: [],
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const handleUploadFiles = useCallback(async () => {
    const filesToUpload = state.files.filter(file => file.file instanceof File);

    if (filesToUpload.length === 0) {
      toast.error('Nema fajlova za otpremanje.');
      return;
    }

    try {
      setState(prev => ({ ...prev, isUploading: true }));

      const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
      const PRESET_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_GALLERY_UPLOAD_PRESET!;

      const uploadPromises = filesToUpload.map(async file => {
        const formData = new FormData();
        formData.append('file', file.file as File);
        formData.append('folder', `${session.data?.user?.id}`); // folder name inside gallery folder is organization id
        formData.append('upload_preset', PRESET_NAME);

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress(progressEvent) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1)
              );

              setState(prev => ({
                ...prev,
                files: prev.files.map(f => (f.id === file.id ? { ...f, percentage: progress } : f)),
              }));
            },
          }
        );

        const {
          secure_url: secureUrl,
          url,
          public_id: publicId,
          asset_id: assetId,
          bytes,
          original_filename: originalFilename,
        } = response.data as {
          secure_url?: string;
          url?: string;
          public_id?: string;
          asset_id?: string;
          bytes?: number;
          original_filename?: string;
        };

        const fallbackPreviewUrl = file.preview ?? '';
        const finalUrl = secureUrl ?? url ?? fallbackPreviewUrl;

        setState(prev => {
          const updatedFiles = prev.files.map(f => {
            if (f.id !== file.id) {
              return f;
            }

            if (f.preview && f.file instanceof File && f.file.type.startsWith('image/')) {
              URL.revokeObjectURL(f.preview);
            }

            const uploadedMetadata: FileMetadata = {
              name: originalFilename ?? f.file.name,
              size: bytes ?? f.file.size,
              type: f.file.type,
              url: finalUrl,
              id: publicId ?? f.id,
            };

            return {
              ...f,
              file: uploadedMetadata,
              preview: finalUrl || f.preview,
              percentage: 100,
              uploaded: true,
            };
          });

          onFilesChange?.(updatedFiles);

          return {
            ...prev,
            files: updatedFiles,
          };
        });

        return {
          id: publicId ?? file.id,
          url: finalUrl,
          assetId,
        };
      });

      const uploadResults = await Promise.all(uploadPromises); // Wait for all uploads to complete (run in parallel)

      onUploadComplete?.(uploadResults); // Notify parent component of upload completion

      setState(prev => ({
        ...prev,
        isUploading: false,
      }));
    } catch (error: unknown) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data || error.message || 'Neuspešno otpremanje.');
      } else {
        toast.error('Došlo je do neočekivane greške.');
      }
    }
  }, [state.files]);

  const validateFile = useCallback(
    (file: File | FileMetadata): string | null => {
      if (file instanceof File) {
        if (file.size > maxSize) {
          return `Fajl "${file.name}" prelazi maksimalnu dozvoljenu veličinu od ${formatBytes(maxSize)}.`;
        }
      } else {
        if (file.size > maxSize) {
          return `Fajl "${file.name}" prelazi maksimalnu dozvoljenu veličinu od ${formatBytes(maxSize)}.`;
        }
      }

      if (accept !== '*') {
        const acceptedTypes = accept.split(',').map(type => type.trim());
        const fileType = file instanceof File ? file.type || '' : file.type;
        const fileExtension = `.${file instanceof File ? file.name.split('.').pop() : file.name.split('.').pop()}`;

        const isAccepted = acceptedTypes.some(type => {
          if (type.startsWith('.')) {
            return fileExtension.toLowerCase() === type.toLowerCase();
          }
          if (type.endsWith('/*')) {
            const baseType = type.split('/')[0];
            return fileType.startsWith(`${baseType}/`);
          }
          return fileType === type;
        });

        if (!isAccepted) {
          return `Fajl "${file instanceof File ? file.name : file.name}" nije dozvoljenog tipa.`;
        }
      }

      return null;
    },
    [accept, maxSize]
  );

  const createPreview = useCallback((file: File | FileMetadata): string | undefined => {
    if (file instanceof File) {
      return URL.createObjectURL(file);
    }
    return file.url;
  }, []);

  const generateUniqueId = useCallback((file: File | FileMetadata): string => {
    if (file instanceof File) {
      return `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
    return file.id;
  }, []);

  const clearFiles = useCallback(() => {
    setState(prev => {
      // Clean up object URLs
      prev.files.forEach(file => {
        if (file.preview && file.file instanceof File && file.file.type.startsWith('image/')) {
          URL.revokeObjectURL(file.preview);
        }
      });

      if (inputRef.current) {
        inputRef.current.value = '';
      }

      const newState = {
        ...prev,
        files: [],
        errors: [],
        isDragging: false,
        isUploading: false,
      };

      onFilesChange?.(newState.files);
      return newState;
    });
  }, [onFilesChange]);

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      if (!newFiles || newFiles.length === 0) return;

      const newFilesArray = Array.from(newFiles);
      const errors: string[] = [];

      // Clear existing errors when new files are uploaded
      setState(prev => ({ ...prev, errors: [] }));

      // In single file mode, clear existing files first
      if (!multiple) {
        clearFiles();
      }

      // Check if adding these files would exceed maxFiles (only in multiple mode)
      if (
        multiple &&
        maxFiles !== Infinity &&
        state.files.length + newFilesArray.length > maxFiles
      ) {
        const noun = maxFiles === 1 ? 'fotografija' : 'fotografije';
        errors.push(`Možete otpremiti najviše ${maxFiles} ${noun}.`);

        setState(prev => ({ ...prev, errors }));
        return;
      }

      const validFiles: FileWithPreview[] = [];

      newFilesArray.forEach(file => {
        // Only check for duplicates if multiple files are allowed
        if (multiple) {
          const isDuplicate = state.files.some(
            existingFile =>
              existingFile.file.name === file.name && existingFile.file.size === file.size
          );

          // Skip duplicate files silently
          if (isDuplicate) {
            return;
          }
        }

        // Check file size
        if (file.size > maxSize) {
          errors.push(
            multiple
              ? `Neki fajlovi prelaze maksimalnu dozvoljenu veličinu od ${formatBytes(maxSize)}.`
              : `Fajl prelazi maksimalnu dozvoljenu veličinu od ${formatBytes(maxSize)}.`
          );
          return;
        }

        const error = validateFile(file);
        if (error) {
          errors.push(error);
        } else {
          validFiles.push({
            file,
            id: generateUniqueId(file),
            preview: createPreview(file),
          });
        }
      });

      // Only update state if we have valid files to add
      if (validFiles.length > 0) {
        // Call the onFilesAdded callback with the newly added valid files
        onFilesAdded?.(validFiles);

        setState(prev => {
          const newFiles = !multiple ? validFiles : [...prev.files, ...validFiles];
          onFilesChange?.(newFiles);
          return {
            ...prev,
            files: newFiles,
            errors,
          };
        });
      } else if (errors.length > 0) {
        setState(prev => ({
          ...prev,
          errors,
        }));
      }

      // Reset input value after handling files
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [
      state.files,
      maxFiles,
      multiple,
      maxSize,
      validateFile,
      createPreview,
      generateUniqueId,
      clearFiles,
      onFilesChange,
      onFilesAdded,
    ]
  );

  const removeFile = useCallback(
    (id: string) => {
      setState(prev => {
        const fileToRemove = prev.files.find(file => file.id === id);
        if (
          fileToRemove &&
          fileToRemove.preview &&
          fileToRemove.file instanceof File &&
          fileToRemove.file.type.startsWith('image/')
        ) {
          URL.revokeObjectURL(fileToRemove.preview);
        }

        const newFiles = prev.files.filter(file => file.id !== id);
        onFilesChange?.(newFiles);

        return {
          ...prev,
          files: newFiles,
          errors: [],
        };
      });
    },
    [onFilesChange]
  );

  const clearErrors = useCallback(() => {
    setState(prev => ({
      ...prev,
      errors: [],
    }));
  }, []);

  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setState(prev => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }

    setState(prev => ({ ...prev, isDragging: false }));
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setState(prev => ({ ...prev, isDragging: false }));

      // Don't process files if the input is disabled
      if (inputRef.current?.disabled) {
        return;
      }

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        // In single file mode, only use the first file
        if (!multiple) {
          const file = e.dataTransfer.files[0];
          addFiles([file as File]);
        } else {
          addFiles(e.dataTransfer.files);
        }
      }
    },
    [addFiles, multiple]
  );

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(e.target.files);
      }
    },
    [addFiles]
  );

  const openFileDialog = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

  const getInputProps = useCallback(
    (props: InputHTMLAttributes<HTMLInputElement> = {}) => {
      return {
        ...props,
        type: 'file' as const,
        onChange: handleFileChange,
        accept: props.accept || accept,
        multiple: props.multiple !== undefined ? props.multiple : multiple,
        ref: inputRef,
      };
    },
    [accept, multiple, handleFileChange]
  );

  return [
    state,
    {
      handleUploadFiles,
      addFiles,
      removeFile,
      clearFiles,
      clearErrors,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      handleFileChange,
      openFileDialog,
      getInputProps,
    },
  ];
};

// Helper function to format bytes to human-readable format
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 bajta';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['bajta', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i]!;
};
