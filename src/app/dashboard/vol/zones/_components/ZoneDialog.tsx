'use client';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { ZoneFormSchemaType, zoneSchema } from '@/schemas/zoneSchema';

import { Zone } from '@/types/zones.type';
import FormMapWrapper from './form/FormMapWrapper';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Edit3Icon, Loader2Icon, PlusIcon, SaveIcon, Trash2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import FormRadiusSlider from './form/FormRadiusSlider';
import { addZoneAction } from '@/actions/volunteer/addZone.action';
import { useState, useEffect } from 'react';
import { editZoneAction } from '@/actions/volunteer/editZone.action';
import { BarLoader } from 'react-spinners';
import TooltipBasic from '@/components/global/TooltipBasic';
import { cn } from '@/lib/utils';
import { deleteZoneAction } from '@/actions/volunteer/deleteZone.action';

type Props = {
  zone?: Zone;
};

const ZoneDialog = ({ zone }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<ZoneFormSchemaType>({
    resolver: zodResolver(zoneSchema),
    defaultValues: {
      name: '',
      center: {
        latitude: undefined,
        longitude: undefined,
      },
      radius: 1,
    },
  });

  // Resetuj formu sa najnovijim podacima kada se dijalog otvori
  useEffect(() => {
    if (isOpen) {
      if (zone) {
        form.reset({
          name: zone.name,
          center: {
            latitude: zone.latitude,
            longitude: zone.longitude,
          },
          radius: zone.radius,
        });
      } else {
        form.reset({
          name: '',
          center: {
            latitude: undefined,
            longitude: undefined,
          },
          radius: 1,
        });
      }
    }
  }, [isOpen, zone, form]);

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: ZoneFormSchemaType) {
    const { error } = zone ? await editZoneAction(values, zone.id) : await addZoneAction(values);

    if (error) {
      toast.error(error);
    } else {
      if (zone) {
        toast.success('Zona je uspešno izmenjena.');
      } else {
        toast.success('Zona je uspešno dodata.');
      }
      form.reset();
      setIsOpen(false);
    }
  }

  const handleDelete = async () => {
    if (!zone) return;

    setIsDeleting(true);

    const { error } = await deleteZoneAction(zone.id);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Zona je uspešno obrisana.');
      form.reset();
      setIsOpen(false);
    }

    setIsDeleting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {zone ? (
          <Button variant={'ghost'} size={'icon'}>
            <Edit3Icon />
          </Button>
        ) : (
          <Button>
            <PlusIcon />
            Dodaj zonu
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="flex max-h-[95vh] flex-col gap-0 p-0 sm:max-w-2xl">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            {zone ? 'Izmeni zonu' : 'Dodaj zonu'}
          </DialogTitle>

          <div className="relative overflow-y-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Naziv</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='npr. "Stara Planina"'
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="center"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Centar zone</FormLabel>
                      <FormControl>
                        <FormMapWrapper />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="radius"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opseg (u km)</FormLabel>
                      <FormControl>
                        <FormRadiusSlider />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Submit button */}
                <DialogFooter className="w-full pt-2">
                  <div className={cn('flex w-full justify-end gap-2', zone && 'justify-between')}>
                    {zone && (
                      <Button
                        type="button"
                        onClick={handleDelete}
                        variant={'outline'}
                        size={'icon'}
                      >
                        <Trash2Icon />
                      </Button>
                    )}
                    <div className="flex items-center gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">Otkaži</Button>
                      </DialogClose>
                      <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
                        <SaveIcon />
                        Sačuvaj
                      </Button>
                    </div>
                  </div>
                </DialogFooter>
              </form>
            </Form>

            <div className="absolute top-0 left-0 w-full">
              {/* sluzi kao loader i za submit i za delete */}
              <BarLoader color="green" width={'100%'} loading={isSubmitting || isDeleting} />
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ZoneDialog;
