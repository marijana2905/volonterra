'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { replyQuestionSchema, ReplyQuestionSchemaType } from '@/schemas/askQuestionSchema';

import { replyQuestionAction } from '@/actions/question/replyQuestion.action';

import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2Icon, ReplyIcon } from 'lucide-react';
import { toast } from 'sonner';

type ReplyQuestionFormProps = {
  questionId: string;
};

const ReplyQuestionForm = ({ questionId }: ReplyQuestionFormProps) => {
  const form = useForm<ReplyQuestionSchemaType>({
    resolver: zodResolver(replyQuestionSchema),
    defaultValues: { content: '' },
  });

  const isPending = form.formState.isSubmitting;

  async function onSubmit(values: ReplyQuestionSchemaType) {
    const { error } = await replyQuestionAction(values, questionId);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Uspešno ste poslali odgovor na pitanje.');
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col items-start gap-4"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Textarea placeholder="Napišite odgovor..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="ml-auto w-full md:w-auto">
          {isPending ? <Loader2Icon className="animate-spin" /> : <ReplyIcon />}
          Odgovori
        </Button>
      </form>
    </Form>
  );
};

export default ReplyQuestionForm;
