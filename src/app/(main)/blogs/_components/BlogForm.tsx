'use client';

import { useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createBlog } from '@/actions/blog/createBlog.actions';
import { editBlog } from '@/actions/blog/editBlog';

import { Editor } from '@tiptap/react';
import { MinimalTiptapEditor } from '@/components/minimal-tiptap';

import { blogFormSchema, BlogFormSchemaType } from '@/schemas/blogSchema';
import { Post } from '@prisma/types';

import TagInput from './TagInput';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import { SaveIcon } from 'lucide-react';
import { BarLoader } from 'react-spinners';
import { toast } from 'sonner';

type BlogFormProps = {
  blog?: Post;
  onSuccess?: () => void;
};

const BlogForm = ({ blog, onSuccess }: BlogFormProps) => {
  const queryClient = useQueryClient();

  const form = useForm<BlogFormSchemaType>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: blog?.title || '',
      content: blog?.content || '',
      imageUrl: blog?.image || '',
      keywords: blog?.keywords || [],
    },
  });

  const isPending = form.formState.isSubmitting;

  // Ovo je potrebno zbog tip tap editor-a
  const editorRef = useRef<Editor | null>(null);
  const handleCreate = useCallback(
    ({ editor }: { editor: Editor }) => {
      if (form.getValues('content') && editor.isEmpty) {
        editor.commands.setContent(form.getValues('content') ?? '');
      }
      editorRef.current = editor;
    },
    [form],
  );

  async function onSubmit(values: BlogFormSchemaType) {
    const { error } = blog ? await editBlog(values, blog.id) : await createBlog(values);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Blog je uspešno sačuvan!');
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Naslov</FormLabel>
              <FormControl>
                <Input type="text" placeholder="npr. Kako podstaći biodiverzitet?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl className="w-full overflow-auto">
                <MinimalTiptapEditor
                  {...field}
                  throttleDelay={0}
                  className={cn('w-full', {
                    'border-destructive focus-within:border-destructive':
                      form.formState.errors.content,
                  })}
                  output="html"
                  placeholder="Započnite pisanje vašeg bloga ovde..."
                  onCreate={handleCreate}
                  editable={!isPending}
                  editorClassName="focus:outline-hidden p-5 min-h-[200px]"
                  immediatelyRender={false}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ključne reči</FormLabel>
              <FormControl>
                <TagInput value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormDescription>
                Unesite ključne reči koje opisuju vaš blog. Maksimalno 10 ključnih reči.
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {blog ? (
              <>
                <SaveIcon /> Sačuvaj izmene
              </>
            ) : (
              'Dodaj'
            )}
          </Button>
        </div>
        <div className="absolute top-0 left-0 w-full">
          <BarLoader color="green" width={'100%'} loading={isPending} />
        </div>
      </form>
    </Form>
  );
};

export default BlogForm;
