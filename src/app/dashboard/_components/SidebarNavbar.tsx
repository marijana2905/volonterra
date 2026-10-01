import Link from 'next/link';
import { requireSession } from '@/data/auth/requireSession';
import { SidebarTrigger } from '@/components/ui/sidebar';
import UserAvatar from '@/components/navbar/UserAvatar';
import NotificationBell from '@/components/notifications/NotificationBell';

const SidebarNavbar = async () => {
  const session = await requireSession();

  const userProfileLink = `${session.user.role === 'ORGANIZER' ? '/organizations/' : '/volunteers/'}${
    session.user.username
  }`;

  return (
    <nav className="bg-background/80 sticky top-0 z-50 flex h-16 w-full items-center justify-between gap-2 border-b p-4 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <Link href={userProfileLink} className="group flex flex-col gap-x-2 gap-y-0">
          <span className="md:text-md group-hover:text-primary text-sm font-semibold transition-colors">
            {session.user.name}
          </span>
          <span className="text-muted-foreground text-xs font-normal md:text-sm">
            @{session.user.username}
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />
        <UserAvatar session={session} />
      </div>
    </nav>
  );
};

export default SidebarNavbar;
