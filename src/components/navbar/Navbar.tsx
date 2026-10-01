import { getUserSession } from '@/data/auth/getUserSession';

import { ThemeToggleButton } from '@/components/global/ThemeToggleButton';
import ContentWrapper from '@/components/global/ContentWrapper';
import ButtonLink from '@/components/global/ButtonLink';
import Logo from '@/components/global/Logo';

import MobileNavigationDrawer from './MobileNavigationDrawer';
import LoginRegisterDropdown from './LoginRegisterDropdown';
import DesktopMenu from './DesktopMenu';
import UserAvatar from './UserAvatar';
import NotificationBell from '../notifications/NotificationBell';

const Navbar = async () => {
  const session = await getUserSession();

  return (
    <div className="bg-background/60 sticky top-0 z-50 h-16 border-b backdrop-blur-md">
      <ContentWrapper className="flex h-full items-center justify-between">
        {/* Mobile Menu */}
        <aside className="md:hidden">
          <MobileNavigationDrawer />
        </aside>

        <Logo width={165} height={50} />

        {/* Desktop Menu */}
        <DesktopMenu className="hidden md:block" />

        {/* Desktop Login/Register Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          {session ? (
            <div className="flex items-center gap-4">
              <NotificationBell />
              <UserAvatar session={session} />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <ButtonLink href="/auth/register" variant="outline" label="Registracija" />
              <ButtonLink href="/auth/login" label="Prijava" />
              <ThemeToggleButton />
            </div>
          )}
        </div>

        {/* Mobile Login/Register Dropdown */}
        {session ? (
          <div className="flex items-center gap-4 lg:hidden">
            <NotificationBell />

            <UserAvatar session={session} />
          </div>
        ) : (
          <LoginRegisterDropdown />
        )}
      </ContentWrapper>
    </div>
  );
};

export default Navbar;
