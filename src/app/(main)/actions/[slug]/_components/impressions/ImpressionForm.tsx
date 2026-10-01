'use client';

import CustomDialog from '@/components/global/CustomDialog';
import StarRating from '@/components/global/StarRating';
import { Button } from '@/components/ui/button';
import { impressionFormSchema, ImpressionFormSchemaType } from '@/schemas/impressionSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActionImpression } from '@prisma/types';
import { SaveIcon } from 'lucide-react';
import React, { useCallback, useRef } from 'react';
import { Editor } from '@tiptap/react';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { BarLoader } from 'react-spinners';
import { MinimalTiptapEditor } from '@/components/minimal-tiptap';
import { cn } from '@/lib/utils';
import { addImpressionToAction } from '@/actions/action/addImpression.action';
import { toast } from 'sonner';
import { editImpression } from '@/actions/action/editImpression.action';

type Props = {
  actionId: string;
  impression?: ActionImpression;
  onClose?: () => void;
};

const ImpressionForm = ({ actionId, impression, onClose }: Props) => {
  const form = useForm<ImpressionFormSchemaType>({
    resolver: zodResolver(impressionFormSchema),
    defaultValues: {
      rating: impression?.rating ?? 0,
      comment: impression?.comment || '',
    },
  });

  const isPending = form.formState.isSubmitting;

  // Ovo je potrebno zbog tip tap editor-a
  const editorRef = useRef<Editor | null>(null);
  const handleCreate = useCallback(
    ({ editor }: { editor: Editor }) => {
      if (form.getValues('comment') && editor.isEmpty) {
        editor.commands.setContent(form.getValues('comment') ?? '');
      }
      editorRef.current = editor;
    },
    [form],
  );

  async function onSubmit(values: ImpressionFormSchemaType) {
    const { error } = impression
      ? await editImpression(values, impression.id)
      : await addImpressionToAction(values, actionId);

    if (error) {
      toast.error(error);
    } else {
      toast.success(`Utisak je uspešno ${impression ? 'izmenjen' : 'dodat'}.`);
      onClose?.();
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ocena</FormLabel>
              <FormControl>
                <StarRating
                  value={field.value ?? 0}
                  onChange={(value) => field.onChange(value)}
                  onBlur={field.onBlur}
                  size={48}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Komentar</FormLabel>
              <FormControl className="w-full overflow-auto">
                <MinimalTiptapEditor
                  {...field}
                  throttleDelay={0}
                  className={cn('w-full', {
                    'border-destructive focus-within:border-destructive':
                      form.formState.errors.comment,
                  })}
                  output="html"
                  placeholder="Ostavite vaš utisak o akciji ovde..."
                  onCreate={handleCreate}
                  editable={!isPending}
                  editorClassName="focus:outline-hidden p-5 min-h-[200px]"
                  immediatelyRender={false}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={'outline'}
              disabled={isPending}
              onClick={() => onClose?.()}
            >
              Otkaži
            </Button>
            <Button type="submit" disabled={isPending}>
              {impression ? (
                <>
                  <SaveIcon /> Sačuvaj izmene
                </>
              ) : (
                'Postavi'
              )}
            </Button>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full">
          <BarLoader color="green" width={'100%'} loading={isPending} />
        </div>
      </form>
    </Form>
  );
};

export default ImpressionForm;
