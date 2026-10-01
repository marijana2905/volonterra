'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PickaxeIcon, TextIcon, Users2Icon } from 'lucide-react';
import { VscOrganization } from 'react-icons/vsc';

type MobileMenuProps = {
  onClose: () => void;
};

const MobileMenu = ({ onClose }: MobileMenuProps) => {
  return (
    <div className="flex flex-col space-y-4">
      <Button variant="ghost" className="w-full justify-start text-base" onClick={onClose} asChild>
        <Link href="/actions">
          <PickaxeIcon />
          Akcije
        </Link>
      </Button>

      <Button variant="ghost" className="w-full justify-start text-base" onClick={onClose} asChild>
        <Link href="/organizations">
          <VscOrganization />
          Organizacije
        </Link>
      </Button>

      <Button variant="ghost" className="w-full justify-start text-base" onClick={onClose} asChild>
        <Link href="/volunteers">
          <Users2Icon />
          Volonteri
        </Link>
      </Button>

      <Button variant="ghost" className="w-full justify-start text-base" onClick={onClose} asChild>
        <Link href="/blogs">
          <TextIcon />
          Eko Blog
        </Link>
      </Button>
    </div>
  );
};

export default MobileMenu;
