import BackButton from '@/components/global/BackButton';

import { Card, CardContent } from '@/components/ui/card';
import { GhostIcon } from 'lucide-react';

export const metadata = {
  title: 'Greška 404 - Akcija nije pronađena',
};

const NotFound = () => {
  return (
    <div
      className="flex flex-col items-center justify-center px-4 py-12 text-center"
      style={{ height: 'calc(100vh - 4rem)' }}
    >
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-6 py-10">
          <GhostIcon className="text-primary h-12 w-12" />
          <h1 className="text-primary text-4xl font-bold">Greška 404</h1>
          <p className="text-muted-foreground text-sm">
            Akcija koju želite da izmenite nije pronađena. Proverite da li je URL ispravan ili da li
            akcija postoji.
          </p>

          <BackButton href="/dashboard/org/actions" label="Akcije" variant="default" />
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
