'use client';

import { useForm } from 'react-hook-form';
import { useCallback, useRef } from 'react';

import { cn } from '@/lib/utils';
import { Editor } from '@tiptap/react';

import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema, Step1Values } from '@/schemas/actionSchema';

import { MultiSelect } from '@/components/global/MultiSelect';
import { MinimalTiptapEditor } from '@/components/minimal-tiptap';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useActionCategories } from '@/hooks/useActionCategories';

type Props = {
  defaultValues: Step1Values;
  onSubmit?: (data: Step1Values) => void;
};

const Step1 = ({ defaultValues, onSubmit }: Props) => {
  const form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues,
  });

  // Fetch categories using a custom hook
  const { data: categories, isLoading: isLoadingCategories } = useActionCategories();

  // Ovo je potrebno zbog tip tap editor-a
  const editorRef = useRef<Editor | null>(null);
  const handleCreate = useCallback(
    ({ editor }: { editor: Editor }) => {
      if (form.getValues('description') && editor.isEmpty) {
        editor.commands.setContent(form.getValues('description') ?? '');
      }
      editorRef.current = editor;
    },
    [form]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit!)} className="space-y-6">
        <div className="mx-auto w-full max-w-2xl space-y-6">
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Naslov</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription>Npr. "Čišćenje plaže", "Sadnja drveća na Keju"</FormDescription>
              </FormItem>
            )}
          />

          <FormField
            name="categories"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategorije</FormLabel>
                <FormControl>
                  {isLoadingCategories || categories === undefined ? (
                    <Input
                      value="Učitavanje kategorija..."
                      disabled
                      className="cursor-not-allowed"
                    />
                  ) : (
                    <MultiSelect
                      options={categories.map(category => ({
                        value: category.id,
                        label: category.name,
                      }))}
                      onValueChange={value => {
                        field.onChange(value);
                      }}
                      defaultValue={field.value ?? []}
                      placeholder="Izaberite kategorije"
                      variant="secondary"
                      maxCount={3}
                      {...field}
                    />
                  )}
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Odaberite jednu ili više kategorija koje najbolje opisuju akciju.
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl className="w-full overflow-auto">
                  <MinimalTiptapEditor
                    {...field}
                    throttleDelay={0}
                    className={cn('w-full', {
                      'border-destructive focus-within:border-destructive':
                        form.formState.errors.description,
                    })}
                    output="html"
                    placeholder="Unesite detaljan opis akcije"
                    onCreate={handleCreate}
                    editorClassName="focus:outline-hidden p-5 min-h-[200px]"
                    immediatelyRender={false}
                    autofocus={false}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Opis mora biti detaljan i jasan, kako bi učesnici znali šta da očekuju.
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="w-1/2 md:w-fit" disabled={!form.formState.isValid}>
            Dalje
            <ArrowRight />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Step1;
