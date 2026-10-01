'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { loginFormSchema, LoginFormSchemaType } from '@/schemas/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';

import { loginEmailAction } from '@/actions/auth/login.action';

import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2Icon } from 'lucide-react';

const LoginForm = () => {
  const router = useRouter();

  const form = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const isPending = form.formState.isSubmitting;

  async function onSubmit(values: LoginFormSchemaType) {
    const { error } = await loginEmailAction(values);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Uspešno ste se prijavili!');
      router.push('/');
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Lozinka</FormLabel>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs underline-offset-4 hover:underline"
                  tabIndex={-1}
                >
                  Zaboravljena lozinka?
                </Link>
              </div>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-2 w-full" disabled={isPending}>
          {isPending ? <Loader2Icon className="animate-spin" /> : 'Prijavite se'}
        </Button>

        <div className="mt-2 text-center text-xs">
          Nemate nalog?{' '}
          <Link href="/auth/register" className="underline underline-offset-4">
            Registrujte se
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
