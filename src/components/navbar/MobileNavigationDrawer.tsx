'use client';

import { useState } from 'react';

import Logo from '@/components/global/Logo';

import MobileMenu from './MobileMenu';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { TextIcon, XIcon } from 'lucide-react';

const MobileNavigationDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer direction="left" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <TextIcon size={30} />
      </DrawerTrigger>

      <DrawerContent className="p-4">
        <DrawerHeader className="mb-4 flex flex-row items-start justify-between border-b px-0">
          <DrawerTitle className="pb-4 text-base">
            <div onClick={() => setIsOpen(false)}>
              <Logo width={175} height={50} />
            </div>
          </DrawerTitle>

          <DrawerClose>
            <div className="hover:bg-accent hover:text-primary flex items-center justify-center rounded-full p-2 transition-colors">
              <XIcon size={20} />
            </div>
          </DrawerClose>
        </DrawerHeader>

        <MobileMenu onClose={() => setIsOpen(false)} />
      </DrawerContent>
    </Drawer>
  );
};

export default MobileNavigationDrawer;
