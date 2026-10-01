'use client';

import React from 'react';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { cancelActionSchema, CancelActionSchemaType } from '@/schemas/cancelActionSchema';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BarLoader } from 'react-spinners';
import { cancelAction } from '@/actions/action/cancelAction.action';
import { toast } from 'sonner';

type Props = {
  actionId: string;
  onClose: () => void;
};

const CancelActionForm = ({ actionId, onClose }: Props) => {
  const form = useForm<CancelActionSchemaType>({
    resolver: zodResolver(cancelActionSchema),
    defaultValues: {
      reason: '',
    },
  });

  const isPending = form.formState.isSubmitting;

  async function onSubmit(values: CancelActionSchemaType) {
    const { error } = await cancelAction(values, actionId);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success('Akcija je uspešno otkazana.');
    form.reset();
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razlog otkazivanja</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Unesite razlog otkazivanja"
                  rows={7}
                  tabIndex={-1}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose} disabled={isPending}>
            Odustani
          </Button>
          <Button type="submit" disabled={isPending}>
            Otkaži akciju
          </Button>
        </div>

        <div className="absolute top-0 left-0 w-full">
          <BarLoader color="green" width={'100%'} loading={isPending} />
        </div>
      </form>
    </Form>
  );
};

export default CancelActionForm;
