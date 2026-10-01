'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { BarLoader } from 'react-spinners';
import { banSchema, BanSchemaType } from '@/schemas/banSchema';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { banUserAction } from '@/actions/admin/banUser.action';
import { UserTableRow } from './VolunteersTable';

type BanUserFormProps = {
  userToBan: UserTableRow | null;
  onClose?: () => void;
};

const BanUserForm = ({ userToBan, onClose }: BanUserFormProps) => {
  const form = useForm<BanSchemaType>({
    resolver: zodResolver(banSchema),
    defaultValues: {
      reason: '',
      durationInSeconds: undefined,
    },
  });

  const isPending = form.formState.isSubmitting;

  async function onSubmit(values: BanSchemaType) {
    if (!userToBan) return;

    const { error } = await banUserAction(values, userToBan.id);

    if (error) {
      toast.error(error);
    } else {
      onClose?.();
      toast.success('Korisnik je uspešno banovan.');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
        <FormField
          control={form.control}
          name="durationInSeconds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trajanje zabrane</FormLabel>
              <Select
                onValueChange={val => {
                  if (val === 'never') {
                    field.onChange(undefined);
                  } else {
                    const num = Number(val);
                    field.onChange(Number.isNaN(num) ? undefined : num);
                  }
                }}
                value={field.value === undefined ? 'never' : String(field.value)}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Zauvek" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="604800">7 dana</SelectItem>
                  <SelectItem value="2592000">1 mesec</SelectItem>
                  <SelectItem value="never">Zauvek</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razlog</FormLabel>
              <FormControl>
                <Textarea rows={5} placeholder="Unesite razlog zabrane..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant={'outline'} disabled={isPending} onClick={onClose}>
            Otkaži
          </Button>
          <Button type="submit" disabled={isPending}>
            Potvrdi
          </Button>
        </div>

        <div className="absolute top-0 left-0 w-full">
          <BarLoader color="green" width={'100%'} loading={isPending} />
        </div>
      </form>
    </Form>
  );
};

export default BanUserForm;
