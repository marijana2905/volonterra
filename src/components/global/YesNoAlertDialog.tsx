import React, { useState } from 'react';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { TriangleAlertIcon, Loader2, AlertCircleIcon, InfoIcon } from 'lucide-react';

type Props = {
  variant?: 'error' | 'warning' | 'default';
  title: string;
  description: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  className?: string;
  loadingText?: string;
};

const YesNoAlertDialog = ({
  variant = 'default',
  title,
  description,
  isOpen,
  setIsOpen,
  onConfirm,
  onCancel,
  confirmText = 'Potvrdi',
  cancelText = 'Otkaži',
  className = '',
  loadingText = 'Obrada...',
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case 'error':
        return 'text-destructive';
      case 'warning':
        return 'text-amber-600';
      case 'default':
      default:
        return '';
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'error':
        return (
          <AlertCircleIcon className="me-3 -mt-0.5 inline-flex" size={20} aria-hidden="true" />
        );
      case 'warning':
        return (
          <TriangleAlertIcon className="me-3 -mt-0.5 inline-flex" size={20} aria-hidden="true" />
        );
      case 'default':
      default:
        return <InfoIcon className="me-3 -mt-0.5 inline-flex" size={20} aria-hidden="true" />;
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case 'error':
        return 'bg-destructive hover:bg-red-600 text-white';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 text-white';
      case 'default':
      default:
        return 'bg-primary hover:bg-primary/90 text-white';
    }
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      setIsOpen(false);
    } catch (error) {
      console.error('Error during confirmation action:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className={className}>
        <AlertDialogHeader>
          <AlertDialogTitle className={`flex items-center ${getVariantStyles()}`}>
            <div className="hidden md:block">{getIcon()}</div>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              onCancel?.();
              setIsOpen(false);
            }}
            disabled={isLoading}
          >
            {cancelText}
          </AlertDialogCancel>
          <Button onClick={handleConfirm} className={getButtonVariant()} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {loadingText}
              </>
            ) : (
              confirmText
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default YesNoAlertDialog;
