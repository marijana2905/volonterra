import AppSidebar from './_components/AppSidebar';
import SidebarNavbar from './_components/SidebarNavbar';

import { SidebarProvider } from '@/components/ui/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex w-full flex-col">
        <SidebarNavbar />
        <div className="flex-1">{children}</div>
      </main>
    </SidebarProvider>
  );
}
