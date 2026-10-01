'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { changePasswordSchema, ChangePasswordSchemaType } from '@/schemas/changePasswordSchema';

import { changePasswordAction } from '@/actions/auth/changePassword.action';

import PasswordInput from '@/app/auth/_components/PasswordInput';

import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2Icon, SaveIcon } from 'lucide-react';

const PasswordChangeForm = () => {
  const form = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      password: '',
    },
  });

  const isPending = form.formState.isSubmitting;

  async function onSubmit(values: ChangePasswordSchemaType) {
    const { error } = await changePasswordAction(values);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Lozinka je uspešno promenjena.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trenutna lozinka</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <PasswordInput />

        <Button type="submit" className="w-full md:w-fit" disabled={isPending}>
          {isPending ? <Loader2Icon className="animate-spin" /> : <SaveIcon />} Sačuvaj
        </Button>
      </form>
    </Form>
  );
};

export default PasswordChangeForm;
