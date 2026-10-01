'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2Icon, SaveIcon, LockIcon } from 'lucide-react';
import { accountSchema, AccountSchemaType } from '@/schemas/accountSchema';
import { useSession } from '@/lib/auth-client';
import { Skeleton } from '@/components/ui/skeleton';
import { changeNameAndUsernameAction } from '@/actions/auth/changeNameAndUsername.action';
import AlertCard from '@/components/global/AlertCard';
import { formatDateTime } from '@/lib/utils';

const AccountChangeForm = () => {
  const session = useSession();

  const lastUpdated = session.data?.user?.updatedAt;

  // Allow edit only if last update was more than 7 days ago
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const lastUpdatedDate = lastUpdated ? new Date(lastUpdated) : null;
  const canEdit =
    !lastUpdatedDate || new Date().getTime() - lastUpdatedDate.getTime() > sevenDaysMs;
  const nextAllowedDate = lastUpdatedDate
    ? new Date(lastUpdatedDate.getTime() + sevenDaysMs)
    : null;

  const form = useForm<AccountSchemaType>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: '',
      username: '',
    },
  });

  // Fill form with current user data when is loaded
  useEffect(() => {
    if (session.data?.user) {
      form.reset({
        name: session.data.user.name ?? '',
        username: session.data.user.username ?? '',
      });
    }
  }, [session.data, form]);

  const isPending = form.formState.isSubmitting;

  async function onSubmit(values: AccountSchemaType) {
    const { error } = await changeNameAndUsernameAction(values);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Podaci o nalogu su uspešno izmenjeni.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
        {!canEdit && (
          <AlertCard
            variant="destructive"
            title="Podatke o nalogu možete menjati jednom u 7 dana."
            description={`Sledeća izmena moguća: ${formatDateTime(new Date(nextAllowedDate!))}`}
          />
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {session.data ? (
                  session.data.user.role === 'VOLUNTEER' ? (
                    'Ime i prezime'
                  ) : (
                    'Naziv organizacije'
                  )
                ) : (
                  <Skeleton className="dark:bg-background h-4 w-32" />
                )}
              </FormLabel>
              <FormControl>
                <Input type="text" disabled={!canEdit} {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Korisničko ime</FormLabel>
              <FormControl>
                <Input type="text" disabled={!canEdit} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full md:w-fit"
          title={!canEdit ? 'Podatke je moguće menjati jednom u 7 dana.' : undefined}
          disabled={isPending || form.formState.isDirty === false || !canEdit}
        >
          {isPending ? <Loader2Icon className="animate-spin" /> : <SaveIcon />} Sačuvaj
        </Button>
      </form>
    </Form>
  );
};

export default AccountChangeForm;
