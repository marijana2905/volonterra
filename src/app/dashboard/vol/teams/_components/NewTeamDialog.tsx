'use client';

import { useState } from 'react';

import TeamForm from './TeamForm';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusIcon, XIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const NewTeamDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Novi tim
        </Button>
      </DialogTrigger>
      <DialogContent
        className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg"
        showCloseButton={false}
      >
        <ScrollArea className="flex max-h-full flex-col overflow-hidden">
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="flex items-center justify-between px-6 py-6">
              Novi tim
              <XIcon
                onClick={() => setIsOpen(false)}
                size={20}
                className="hover:text-primary transition-colors"
              />
            </DialogTitle>
            <Separator />
            <DialogDescription asChild>
              <div className="p-6">
                <TeamForm onSuccess={() => setIsOpen(false)} />
              </div>
            </DialogDescription>
          </DialogHeader>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NewTeamDialog;
