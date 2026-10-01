'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { createComment } from '@/actions/blog/createComment.action';
import { editComment } from '@/actions/blog/editComment.action';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { commentFormSchema, CommentFormSchemaType } from '@/schemas/blogSchema';
import { CommentWithAuthor } from '@/types/blog.type';

type Props = {
  postId: string;
  parentId?: string;
  comment?: CommentWithAuthor;
  onSubmitHandle?: () => void;
  onCancelHandle?: () => void;
  autoFocus?: boolean;
};

const CommentForm = ({
  postId,
  parentId,
  comment,
  onSubmitHandle,
  onCancelHandle,
  autoFocus = false,
}: Props) => {
  const form = useForm<CommentFormSchemaType>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      content: comment?.content || '',
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: CommentFormSchemaType) {
    const { error } = comment
      ? await editComment(comment.id, values.content)
      : await createComment(postId, values.content, parentId);

    if (error) {
      toast.error(error);
    } else {
      toast.success(comment ? 'Komentar je uspešno izmenjen.' : 'Komentar je uspešno dodat.');

      onSubmitHandle?.();
      form.reset();
    }
  }

  const maxCharacters = 300;
  const charCount = form.watch('content')?.length || 0;

  return (
    <div className="shadow-none">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
          <div>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormMessage />
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder={
                          parentId ? 'Napiši odgovor na komentar...' : 'Napiši komentar...'
                        }
                        {...field}
                        autoFocus={autoFocus}
                        disabled={isSubmitting}
                        maxLength={maxCharacters}
                        onChange={e => {
                          if (e.target.value.length <= maxCharacters) {
                            field.onChange(e);
                          }
                        }}
                        rows={3}
                      />
                      <div className="text-muted-foreground absolute right-3 bottom-2 text-xs">
                        {charCount}/{maxCharacters}
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-2">
            {parentId && (
              <Button
                disabled={isSubmitting}
                variant="outline"
                size={'sm'}
                className="w-1/4 md:w-fit"
                tabIndex={-1}
                onClick={onCancelHandle}
              >
                Otkaži
              </Button>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              size={'sm'}
              className={`${comment ? 'w-full md:w-fit' : 'w-1/2 md:w-fit'}`}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
              {parentId ? 'Odgovori' : comment ? 'Izmeni' : 'Postavi'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CommentForm;
