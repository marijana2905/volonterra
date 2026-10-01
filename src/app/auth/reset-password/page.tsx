import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { redirect } from 'next/navigation';
import ResetPasswordForm from '../_components/ResetPasswordForm';

export const metadata = {
  title: 'Resetovanje lozinke',
  description: 'Unesite svoju novu lozinku.',
};

type Props = {
  searchParams: Promise<{ token: string }>;
};

const ResetPasswordPage = async ({ searchParams }: Props) => {
  const { token } = await searchParams;

  if (!token) {
    redirect('/auth/login');
  }

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Resetovanje lozinke</CardTitle>
        <CardDescription className="text-muted-foreground">
          Unesite svoju novu lozinku.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="w-full space-y-6">
        <ResetPasswordForm token={token} />
      </CardContent>
    </Card>
  );
};

export default ResetPasswordPage;
