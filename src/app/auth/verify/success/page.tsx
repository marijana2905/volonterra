import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { MailCheck, ArrowRightIcon } from 'lucide-react';

export const metadata = {
  title: 'Uspeh',
};

const SuccessPage = () => {
  return (
    <div className="flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex items-start gap-4">
          <div className="bg-primary/20 flex h-12 w-12 items-center justify-center rounded-full">
            <MailCheck className="text-primary h-6 w-6" />
          </div>

          <div>
            <CardTitle>Uspešno poslat email za verifikaciju</CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              Proverite svoj email i kliknite na link za verifikaciju.
            </p>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="flex flex-col gap-8">
          <p className="text-sm">
            Ako ne vidite poruku, proverite spam folder ili pokušajte da pošaljete verifikacioni
            email ponovo.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-between">
            <Link href="/auth/verify">
              <Button variant="outline">Pokušaj ponovo</Button>
            </Link>

            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Prijavi se
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessPage;
