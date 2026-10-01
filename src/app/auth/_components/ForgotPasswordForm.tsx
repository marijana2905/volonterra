'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { forgotPasswordForm, ForgotPasswordFormType } from '@/schemas/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2Icon, SendIcon } from 'lucide-react';
import { requestPasswordReset } from '@/lib/auth-client';

const SendVerificationEmailForm = () => {
  const router = useRouter();

  const form = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordForm),
    defaultValues: {
      email: '',
    },
  });

  const isPending = form.formState.isSubmitting;

  async function onSubmit(values: ForgotPasswordFormType) {
    const { email } = values;

    await requestPasswordReset({
      email,
      redirectTo: '/auth/reset-password',
      fetchOptions: {
        onError: (error: unknown) => {
          console.error('[FORGOT PASSWORD ERROR]', error);
          toast.error('Neuspešno slanje emaila za resetovanje lozinke');
        },
        onSuccess: () => {
          toast.success('Email za resetovanje lozinke je uspešno poslat. Proverite inbox.');
          router.push('/auth/forgot-password/success');
        },
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email adresa</FormLabel>
              <FormControl>
                <Input type="email" placeholder="m@example.com" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-2 w-full" disabled={isPending}>
          {isPending ? <Loader2Icon className="animate-spin" /> : <SendIcon />}
          Pošalji link
        </Button>
      </form>
    </Form>
  );
};

export default SendVerificationEmailForm;
