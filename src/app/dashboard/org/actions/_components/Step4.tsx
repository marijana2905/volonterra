'use client';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { step4Schema, Step4Values } from '@/schemas/actionSchema';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, SaveIcon } from 'lucide-react';
import SingleImageUploader from './SingleImageUploader';

type Props = {
  defaultValues: Step4Values;
  onSubmit: (data: Step4Values) => void;
  onBack: (data: Step4Values) => void;
  isEdit?: boolean;
  isLoading: boolean;
};
const Step4 = ({ defaultValues, onSubmit, onBack, isEdit, isLoading }: Props) => {
  const form = useForm<Step4Values>({
    resolver: zodResolver(step4Schema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mx-auto w-full max-w-2xl space-y-6">
          <div className="flex flex-col gap-4">
            <FormField
              name="bannerImage"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Baner akcije</FormLabel>
                  <FormControl>
                    <SingleImageUploader
                      initialFileUrl={field.value || ''}
                      onFileChange={fileUrl => {
                        field.onChange(fileUrl);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex w-full items-start gap-2">
            <FormField
              name="minParticipants"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Minimalan broj učesnika</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      onChange={async e => {
                        const value = parseInt(e.target.value) || 0;
                        field.onChange(value);
                        // Trigger validation for both fields when minParticipants changes
                        await form.trigger(['minParticipants', 'maxParticipants']);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="maxParticipants"
              control={form.control}
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormLabel>Maksimalan broj učesnika</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      onChange={async e => {
                        const value = parseInt(e.target.value) || 0;
                        field.onChange(value);
                        // Trigger validation for both fields when maxParticipants changes
                        await form.trigger(['minParticipants', 'maxParticipants']);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col-reverse items-start justify-between gap-y-4 md:flex-row md:items-center">
          <Button
            type="button"
            onClick={() => onBack(form.getValues())}
            variant="outline"
            className="w-1/2 md:w-fit"
            tabIndex={-1}
            disabled={isLoading}
          >
            <ArrowLeft />
            Nazad
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={!form.formState.isValid || isLoading}
            className="w-full md:w-fit"
          >
            {isEdit && <SaveIcon />}
            {isEdit ? 'Sačuvaj izmene' : 'Kreiraj akciju'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Step4;
