'use client';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { step3Schema, Step3Values } from '@/schemas/actionSchema';

import TimeCalendar from './TimeCalendar';

import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type Props = {
  defaultValues: Step3Values;
  onSubmit: (data: Step3Values) => void;
  onBack: (data: Step3Values) => void;
};
const Step3 = ({ defaultValues, onSubmit, onBack }: Props) => {
  const form = useForm<Step3Values>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      dateRange: {
        from: new Date(defaultValues.dateRange.from),
        to: new Date(defaultValues.dateRange.to),
      },
      startTime: defaultValues.startTime,
      endTime: defaultValues.endTime,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="mx-auto w-full max-w-2xl space-y-6">
          <TimeCalendar />
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            onClick={() => onBack(form.getValues())}
            variant="outline"
            className="w-1/2 md:w-fit"
            tabIndex={-1}
          >
            <ArrowLeft />
            Nazad
          </Button>

          <Button
            type="submit"
            disabled={!form.formState.isValid}
            className="ml-2 w-1/2 md:ml-0 md:w-fit"
          >
            Dalje
            <ArrowRight />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Step3;
