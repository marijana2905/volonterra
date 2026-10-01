'use client';

import { resetPassword } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { resetPasswordForm, ResetPasswordFormType } from '@/schemas/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2Icon, LockIcon } from 'lucide-react';
import PasswordInput from './PasswordInput';

type Props = {
  token: string;
};

const ResetPasswordForm = ({ token }: Props) => {
  const router = useRouter();

  const form = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordForm),
    defaultValues: {
      password: '',
    },
  });

  const isPending = form.formState.isSubmitting;

  async function onSubmit(values: ResetPasswordFormType) {
    const { password } = values;

    await resetPassword({
      newPassword: password,
      token,
      fetchOptions: {
        onError: error => {
          console.error('[RESET PASSWORD ERROR]', error);
          toast.error('Neuspešno resetovanje lozinke. Proverite da li je token ispravan.');
        },
        onSuccess: () => {
          toast.success('Lozinka je uspešno resetovana. Možete se prijaviti.');
          router.push('/auth/login');
        },
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PasswordInput />

        <Button type="submit" className="mt-2 w-full" disabled={isPending}>
          {isPending ? <Loader2Icon className="animate-spin" /> : <LockIcon />}
          Resetuj lozinku
        </Button>
      </form>
    </Form>
  );
};

export default ResetPasswordForm;
