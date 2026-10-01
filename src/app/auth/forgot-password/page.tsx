import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ForgotPasswordForm from '../_components/ForgotPasswordForm';

export const metadata = {
  title: 'Zaboravljena lozinka',
  description: 'Unesite svoju email adresu da biste resetovali lozinku.',
};

const ForgotPasswordPage = () => {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Zaboravljena lozinka</CardTitle>
        <CardDescription className="text-muted-foreground">
          Unesite svoju email adresu da biste resetovali lozinku.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="w-full space-y-6">
        <ForgotPasswordForm />
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordPage;
