import Link from 'next/link';

import { Session } from '@/lib/auth';

import { LogoutDropdownItem } from '@/components/global/LogoutButton';
import { ThemeSwitch } from '@/components/global/ThemeToggleButton';
import MyAvatar from '@/components/global/MyAvatar';

import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CalendarIcon,
  ChartNoAxesCombinedIcon,
  FileTextIcon,
  FolderOpenIcon,
  ImagesIcon,
  LayoutDashboardIcon,
  MapPinIcon,
  MessageCircleQuestionMarkIcon,
  PickaxeIcon,
  SettingsIcon,
  UserPenIcon,
  UsersIcon,
} from 'lucide-react';
import { VscOrganization } from 'react-icons/vsc';

type Props = {
  session: Session;
};

const UserAvatar = ({ session }: Props) => {
  const user = session.user;
  const userRole =
    user.role === 'VOLUNTEER' ? 'volonter' : user.role === 'ORGANIZER' ? 'organizator' : 'admin';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <MyAvatar
          imageUrl={user.image || '/default_avatar.svg'}
          fallbackText={user.name}
          className="border"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="text-sm">
          <span className="font-semibold">{user.name}</span>
          <br />
          <span className="font-normal">{user.email}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="group">
          <Link
            href={
              user.role === 'VOLUNTEER'
                ? '/dashboard/vol/profile'
                : user.role === 'ORGANIZER'
                  ? '/dashboard/org/profile'
                  : '/dashboard/admin/statistics'
            }
            className="flex w-full items-center gap-2"
          >
            {user.role === 'ADMIN' ? (
              <>
                <LayoutDashboardIcon className="group-hover:text-accent-foreground" /> Kontrolna
                tabla
              </>
            ) : (
              <>
                <UserPenIcon className="group-hover:text-accent-foreground" /> Profil
              </>
            )}
            <div className="ml-auto">
              <Badge className="mx-0">{userRole}</Badge>
            </div>
          </Link>
        </DropdownMenuItem>

        {user.role === 'ORGANIZER' && (
          <>
            <DropdownMenuItem className="group">
              <Link href="/dashboard/org/statistics" className="flex w-full items-center gap-2">
                <ChartNoAxesCombinedIcon className="group-hover:text-accent-foreground" />
                Statistika
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="group">
              <Link href="/dashboard/org/actions" className="flex w-full items-center gap-2">
                <PickaxeIcon className="group-hover:text-accent-foreground" /> Akcije
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="group">
              <Link href="/dashboard/org/calendar" className="flex w-full items-center gap-2">
                <CalendarIcon className="group-hover:text-accent-foreground" /> Kalendar
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="group">
              <Link href="/dashboard/org/gallery" className="flex w-full items-center gap-2">
                <ImagesIcon className="group-hover:text-accent-foreground" /> Galerija
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="group">
              <Link href="/dashboard/org/questions" className="flex w-full items-center gap-2">
                <MessageCircleQuestionMarkIcon className="group-hover:text-accent-foreground" />
                Pitanja
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="group">
              <Link href="/dashboard/org/settings" className="flex w-full items-center gap-2">
                <SettingsIcon className="group-hover:text-accent-foreground" />
                Podešavanja
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {user.role === 'VOLUNTEER' && (
          <>
            <DropdownMenuItem className="group">
              <Link href="/dashboard/vol/statistics" className="flex w-full items-center gap-2">
                <ChartNoAxesCombinedIcon className="group-hover:text-accent-foreground" />
                Statistika
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="group">
              <Link href="/dashboard/vol/actions" className="flex w-full items-center gap-2">
                <PickaxeIcon className="group-hover:text-accent-foreground" /> Moje prijave
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="group">
              <Link href="/dashboard/vol/zones" className="flex w-full items-center gap-2">
                <MapPinIcon className="group-hover:text-accent-foreground" /> Zone interesa
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="group">
              <Link href="/dashboard/vol/calendar" className="flex w-full items-center gap-2">
                <CalendarIcon className="group-hover:text-accent-foreground" /> Kalendar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="group">
              <Link href="/dashboard/vol/teams" className="flex w-full items-center gap-2">
                <VscOrganization className="group-hover:text-accent-foreground" /> Timovi
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="group">
              <Link href="/dashboard/vol/questions" className="flex w-full items-center gap-2">
                <MessageCircleQuestionMarkIcon className="group-hover:text-accent-foreground" />
                Pitanja
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="group">
              <Link href="/dashboard/vol/settings" className="flex w-full items-center gap-2">
                <SettingsIcon className="group-hover:text-accent-foreground" />
                Podešavanja
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {user.role === 'ADMIN' && (
          <>
            <DropdownMenuItem className="group">
              <Link href="/dashboard/admin/organizers" className="flex w-full items-center gap-2">
                <VscOrganization className="group-hover:text-accent-foreground" /> Organizatori
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="group">
              <Link href="/dashboard/admin/volunteers" className="flex w-full items-center gap-2">
                <UsersIcon className="group-hover:text-accent-foreground" /> Volonteri
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="group">
              <Link href="/dashboard/admin/blogs" className="flex w-full items-center gap-2">
                <FileTextIcon className="group-hover:text-accent-foreground" />
                Blogovi
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="group">
              <Link href="/dashboard/admin/categories" className="flex w-full items-center gap-2">
                <FolderOpenIcon className="group-hover:text-accent-foreground" />
                Kategorije akcija
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="group">
              <Link href="/dashboard/admin/settings" className="flex w-full items-center gap-2">
                <SettingsIcon className="group-hover:text-accent-foreground" />
                Podešavanja
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        <div className="flex items-center justify-between gap-2 px-2 py-1 text-sm">
          Tema
          <ThemeSwitch />
        </div>

        <DropdownMenuSeparator />

        <LogoutDropdownItem />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
