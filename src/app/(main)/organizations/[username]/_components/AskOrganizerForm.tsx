'use client';

import { useSession } from '@/lib/auth-client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { askQuestionSchema, AskQuestionSchemaType } from '@/schemas/askQuestionSchema';

import { createQuestionAction } from '@/actions/question/createQuestion.action';

import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import { Loader2Icon, SendHorizonalIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import AlertCard from '@/components/global/AlertCard';

type AskOrganizerFormProps = {
  organizerId: string;
};

const AskOrganizerForm = ({ organizerId }: AskOrganizerFormProps) => {
  const session = useSession();

  const form = useForm<AskQuestionSchemaType>({
    resolver: zodResolver(askQuestionSchema),
    defaultValues: { title: '', email: '' },
  });

  const isPending = form.formState.isSubmitting;

  async function onSubmit(values: AskQuestionSchemaType) {
    if (!session.data?.user && !values.email.trim()) {
      toast.error('Molimo unesite email adresu kako bi Vas organizacija mogla kontaktirati.');
      return;
    }

    const payload: AskQuestionSchemaType = {
      ...values,
      email: values.email.trim(),
    };

    const { error } = await createQuestionAction(payload, organizerId);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Pitanje je uspešno poslato organizaciji. Bićete obavešteni o odgovoru.');
      form.reset();
    }
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Email samo kada korisnik nije logovan */}
          {!session.data && (
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Unesite svoj email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pitanje</FormLabel>
                <FormControl>
                  <Textarea placeholder="Postavite pitanje organizaciji" rows={6} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending} className="w-full md:w-fit">
              Postavi pitanje
              {isPending ? <Loader2Icon className="animate-spin" /> : <SendHorizonalIcon />}
            </Button>
          </div>
        </form>
      </Form>

      {session ? (
        <AlertCard
          title="Razgovor unutar postavljenog pitanja možete pratiti u kontrolnoj tabli."
          description="Organizacija može videti Vašu email adresu i korisničko ime."
        />
      ) : (
        <AlertCard title="Email adresa je dostupna samo organizaciji kojoj postavljate pitanje." />
      )}
    </div>
  );
};

export default AskOrganizerForm;
