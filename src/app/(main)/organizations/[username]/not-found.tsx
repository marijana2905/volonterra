import Logo from '@/components/global/Logo';
import BackButton from '@/components/global/BackButton';

import { Card, CardContent } from '@/components/ui/card';
import { GhostIcon } from 'lucide-react';

export const metadata = {
  title: '404 - Organizator nije pronađen',
};

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 text-center">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-6 py-10">
          <GhostIcon className="text-primary h-12 w-12" />
          <h1 className="text-primary text-4xl font-bold">Greška 404</h1>
          <p className="text-muted-foreground text-sm">Organizacija koju tražite nije pronađena.</p>

          <BackButton href="/organizations" label="Sve organizacije" variant="default" />
        </CardContent>
      </Card>

      <div className="mt-10">
        <Logo width={160} height={50} />
      </div>
    </div>
  );
};

export default NotFound;
