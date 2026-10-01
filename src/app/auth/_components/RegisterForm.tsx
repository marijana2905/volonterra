'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { registerFormSchema, RegisterFormSchemaType } from '@/schemas/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';

import { registerEmailAction } from '@/actions/auth/register.action';

import PasswordInput from './PasswordInput';
import UserTypeRadioButtons from './UserTypeRadioButtons';
import TooltipBasic from '@/components/global/TooltipBasic';

import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { CircleQuestionMark, Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const RegisterForm = () => {
  const router = useRouter();

  const form = useForm<RegisterFormSchemaType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      userType: 'volunteer',
      name: '',
      username: '',
      email: '',
      password: '',
    },
  });

  const isPending = form.formState.isSubmitting;

  async function onSubmit(values: RegisterFormSchemaType) {
    const { error } = await registerEmailAction(values);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Uspešno ste se registrovali! Proverite svoj email da potvrdite nalog.');
      router.push('/auth/verify/success');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <UserTypeRadioButtons />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                {form.watch('userType') === 'volunteer' ? 'Ime i prezime' : 'Naziv organizacije'}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    form.watch('userType') === 'volunteer' ? 'npr. Marko Marković' : 'npr. Eko Ora'
                  }
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Korisničko ime</FormLabel>
                <TooltipBasic
                  content="Samo mala i velika slova, cifre i donja crta."
                  element={<CircleQuestionMark className="opacity-30" size={16} />}
                />
              </div>
              <FormControl>
                <Input
                  placeholder={
                    form.watch('userType') === 'volunteer' ? 'npr. marko_m' : 'npr. eko_ora'
                  }
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

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

        <PasswordInput />

        <Button type="submit" className="mt-2 w-full" disabled={isPending}>
          {isPending ? <Loader2Icon className="animate-spin" /> : 'Registrujte se'}
        </Button>

        <div className="mt-2 text-center text-xs">
          Već imate nalog?{' '}
          <Link href="/auth/login" className="underline underline-offset-4">
            Prijavite se
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
