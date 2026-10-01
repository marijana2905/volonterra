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

import { BarLoader } from 'react-spinners';
import { Textarea } from '@/components/ui/textarea';
import { ActionCategoryWithCount } from '@/types/action-category.type';
import { actionCategory, ActionCategoryType } from '@/schemas/actionCategorySchema';
import { Input } from '@/components/ui/input';
import { Loader2Icon, SaveIcon, Trash2Icon } from 'lucide-react';
import { editActionCategory } from '@/actions/action-category/editActionCategory.action';
import { createActionCategory } from '@/actions/action-category/createActionCategory.action';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { deleteActionCategory } from '@/actions/action-category/deleteActionCategory.action';
import { useState } from 'react';

type CategoryFormProps = {
  category?: ActionCategoryWithCount | null;
  onClose?: () => void;
};

const CategoryForm = ({ category, onClose }: CategoryFormProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<ActionCategoryType>({
    resolver: zodResolver(actionCategory),
    defaultValues: {
      title: category?.name || '',
      description: category?.description || '',
    },
  });

  const isPending = form.formState.isSubmitting;

  async function onSubmit(values: ActionCategoryType) {
    const { error } = category
      ? await editActionCategory(values, category.id)
      : await createActionCategory(values);

    if (error) {
      toast.error(error);
    } else {
      toast.success(`Kategorija je uspešno ${category ? 'izmenjena' : 'kreirana'}.`);
      onClose?.();
    }
  }

  const handleDelete = async () => {
    if (!category) return;

    setIsDeleting(true);

    const { error } = await deleteActionCategory(category.id);

    if (error) {
      toast.error(error);
      setIsDeleting(false);
    } else {
      toast.success('Kategorija je uspešno obrisana.');
      onClose?.();
      setIsDeleting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Naziv</FormLabel>
              <FormControl>
                <Input placeholder="Unesite naziv kategorije..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opis</FormLabel>
              <FormControl>
                <Textarea placeholder="Unesite opis kategorije..." {...field} rows={5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between gap-2">
          {category?.count === 0 ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" type="button" size="icon" onClick={handleDelete}>
                  {isDeleting ? <Loader2Icon className="animate-spin" /> : <Trash2Icon />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Brisanje kategorije</TooltipContent>
            </Tooltip>
          ) : (
            <span></span>
          )}

          <div className="flex items-center gap-2">
            <Button type="button" variant={'outline'} disabled={isPending} onClick={onClose}>
              Otkaži
            </Button>
            <Button type="submit" disabled={isPending}>
              {category ? (
                <>
                  <SaveIcon />
                  Sačuvaj izmene
                </>
              ) : (
                <>Potvrdi</>
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

export default CategoryForm;
