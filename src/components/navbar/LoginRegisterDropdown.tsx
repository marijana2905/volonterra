import Link from 'next/link';

import { ThemeSwitch } from '@/components/global/ThemeToggleButton';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogInIcon, UserCircleIcon, UserIcon } from 'lucide-react';

const LoginRegisterDropdown = () => {
  return (
    <div className="flex items-center justify-center lg:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserCircleIcon size={30} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/auth/login" className="flex items-center gap-2">
              <LogInIcon />
              Prijava
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/auth/register" className="flex items-center gap-2">
              <UserIcon />
              Registracija
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <div className="flex items-center justify-between gap-2 px-2 py-1 text-sm">
            Tema
            <ThemeSwitch />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LoginRegisterDropdown;
