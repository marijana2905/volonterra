import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SendVerificationEmailForm from '../_components/SendVerificationEmailForm';
import { Separator } from '@/components/ui/separator';

export const metadata = {
  title: 'Verifikacija naloga',
  description: 'Potvrdite svoj email da biste aktivirali nalog.',
};

type Props = {
  searchParams: Promise<{ error: string }>;
};

const VerifyPage = async ({ searchParams }: Props) => {
  const sp = await searchParams;

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Verifikacija naloga</CardTitle>
        <CardDescription className="text-destructive">
          {sp.error === 'invalid_token' || sp.error == 'token_expired'
            ? 'Vaš verifikacioni link je nevažeći ili je istekao. Molimo zatražite novi.'
            : 'Greška. Molimo pokušajte ponovo.'}
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="w-full space-y-6">
        <SendVerificationEmailForm />
      </CardContent>
    </Card>
  );
};

export default VerifyPage;
