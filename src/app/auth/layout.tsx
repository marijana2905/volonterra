import BackButton from '@/components/global/BackButton';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-between p-6">
      <div className="mb-4 flex w-full justify-start">
        <BackButton href="/" label="Početna" />
      </div>

      <div className="flex w-full flex-1 flex-col justify-center md:max-w-4xl">{children}</div>

      <div className="text-muted-foreground mt-4 flex w-full justify-center gap-1 text-sm">
        <Link href={'/'} className="underline-offset-3 hover:underline">
          VolonTerra
        </Link>
        &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
