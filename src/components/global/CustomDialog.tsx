'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import { LucideIcon, XIcon } from 'lucide-react';

type CustomDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  title: string;
  icon?: LucideIcon;
  description?: string;
  className?: string;
  children: React.ReactNode;
};

const CustomDialog = ({
  isOpen,
  setIsOpen,
  title,
  icon: Icon,
  description,
  className,
  children,
}: CustomDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className={`flex max-h-[90%] flex-col gap-0 p-0 sm:max-w-xl ${className}`}
        showCloseButton={false}
      >
        <ScrollArea className="flex max-h-full flex-col overflow-hidden">
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle>
              <div className="flex justify-between p-6">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row items-center gap-4">
                    {Icon && <Icon size={18} className="flex-shrink-0" />}
                    <span>{title}</span>
                  </div>
                  {description && (
                    <span className="text-muted-foreground text-sm font-normal">{description}</span>
                  )}
                </div>
                <XIcon
                  onClick={() => setIsOpen(false)}
                  size={20}
                  className="hover:text-primary flex-shrink-0 transition-colors"
                />
              </div>
            </DialogTitle>

            <Separator />

            <DialogDescription asChild>
              <div className="p-6">{children}</div>
            </DialogDescription>
          </DialogHeader>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
