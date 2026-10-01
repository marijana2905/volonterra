'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { VscOrganization } from 'react-icons/vsc';
import {
  BellIcon,
  CalendarIcon,
  ChartNoAxesCombinedIcon,
  ImagesIcon,
  LayoutDashboardIcon,
  MapPinIcon,
  MessageCircleQuestionMarkIcon,
  PickaxeIcon,
  SettingsIcon,
  UserRoundPenIcon,
  UsersIcon,
  FileTextIcon,
  FolderOpenIcon,
} from 'lucide-react';

import { useSession } from '@/lib/auth-client';

import Logo from '@/components/global/Logo';
import { LogoutButton } from '@/components/global/LogoutButton';

import SidebarMenuSkeleton from './SidebarMenuSkeleton';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const organizerMenu = [
  {
    title: 'Statistika',
    url: '/dashboard/org/statistics',
    icon: ChartNoAxesCombinedIcon,
  },
  {
    title: 'Akcije',
    url: '/dashboard/org/actions',
    icon: PickaxeIcon,
  },
  {
    title: 'Kalendar',
    url: '/dashboard/org/calendar',
    icon: CalendarIcon,
  },
  {
    title: 'Uređivanje profila',
    url: '/dashboard/org/profile',
    icon: UserRoundPenIcon,
  },
  {
    title: 'Galerija',
    url: '/dashboard/org/gallery',
    icon: ImagesIcon,
  },
  {
    title: 'Pitanja',
    url: '/dashboard/org/questions',
    icon: MessageCircleQuestionMarkIcon,
  },
  {
    title: 'Obaveštenja',
    url: '/dashboard/org/notifications',
    icon: BellIcon,
  },
  {
    title: 'Podešavanja',
    url: '/dashboard/org/settings',
    icon: SettingsIcon,
  },
];

const volunteerMenu = [
  {
    title: 'Statistika',
    url: '/dashboard/vol/statistics',
    icon: ChartNoAxesCombinedIcon,
  },
  {
    title: 'Moje prijave',
    url: '/dashboard/vol/actions',
    icon: PickaxeIcon,
  },
  {
    title: 'Zone interesa',
    url: '/dashboard/vol/zones',
    icon: MapPinIcon,
  },
  {
    title: 'Timovi',
    url: '/dashboard/vol/teams',
    icon: VscOrganization,
  },
  {
    title: 'Kalendar',
    url: '/dashboard/vol/calendar',
    icon: CalendarIcon,
  },
  {
    title: 'Uređivanje profila',
    url: '/dashboard/vol/profile',
    icon: UserRoundPenIcon,
  },
  {
    title: 'Pitanja',
    url: '/dashboard/vol/questions',
    icon: MessageCircleQuestionMarkIcon,
  },
  {
    title: 'Obaveštenja',
    url: '/dashboard/vol/notifications',
    icon: BellIcon,
  },
  {
    title: 'Podešavanja',
    url: '/dashboard/vol/settings',
    icon: SettingsIcon,
  },
];

const adminMenu = [
  {
    title: 'Kontrolna tabla',
    url: '/dashboard/admin/statistics',
    icon: LayoutDashboardIcon,
  },
  {
    title: 'Organizatori',
    url: '/dashboard/admin/organizers',
    icon: VscOrganization,
  },
  {
    title: 'Volonteri',
    url: '/dashboard/admin/volunteers',
    icon: UsersIcon,
  },
  {
    title: 'Blogovi',
    url: '/dashboard/admin/blogs',
    icon: FileTextIcon,
  },
  {
    title: 'Kategorije akcija',
    url: '/dashboard/admin/categories',
    icon: FolderOpenIcon,
  },
  {
    title: 'Podešavanja',
    url: '/dashboard/admin/settings',
    icon: SettingsIcon,
  },
];

const AppSidebar = () => {
  const pathname = usePathname();
  const { state, setOpenMobile, isMobile } = useSidebar();
  const session = useSession();

  const roleFromPath = useMemo(() => {
    if (!pathname) return null;
    if (pathname.startsWith('/dashboard/admin')) return 'ADMIN' as const;
    if (pathname.startsWith('/dashboard/org')) return 'ORGANIZER' as const;
    if (pathname.startsWith('/dashboard/vol')) return 'VOLUNTEER' as const;
    return null;
  }, [pathname]);

  const resolvedMenu = useMemo(() => {
    const role = session.data?.user.role ?? roleFromPath;
    if (role === 'ADMIN') return adminMenu;
    if (role === 'ORGANIZER') return organizerMenu;
    if (role === 'VOLUNTEER') return volunteerMenu;
    return null;
  }, [session.data?.user.role, roleFromPath]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="pt-3">
        <Logo
          width={state === 'collapsed' ? 40 : 160}
          height={state === 'collapsed' ? 40 : 50}
          type={state === 'collapsed' ? 'icon' : 'icon-text'}
        />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {!resolvedMenu ? (
                <SidebarMenuSkeleton />
              ) : (
                resolvedMenu.map(item => (
                  <SidebarMenuItem
                    key={item.title}
                    className={
                      pathname.includes(item.url)
                        ? 'bg-accent text-accent-foreground rounded-md'
                        : ''
                    }
                  >
                    {!isMobile && state === 'collapsed' ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton asChild>
                            <Link href={item.url} onClick={() => isMobile && setOpenMobile(false)}>
                              <item.icon />
                              <span className="sr-only">{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">{item.title}</TooltipContent>
                      </Tooltip>
                    ) : (
                      <SidebarMenuButton asChild>
                        <Link href={item.url} onClick={() => isMobile && setOpenMobile(false)}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <LogoutButton state={state} isMobile={isMobile} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
