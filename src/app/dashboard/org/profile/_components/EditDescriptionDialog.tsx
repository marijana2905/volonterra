'use client';

import { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editDescriptionFormSchema, EditDescriptionFormSchemaType } from '@/schemas/authSchema';

import { cn } from '@/lib/utils';
import { editProfileDescriptionAction } from '@/actions/organizer/editProfileDescription.action';

import { Editor } from '@tiptap/react';
import { MinimalTiptapEditor } from '@/components/minimal-tiptap';

import { ResponsiveDialog } from '@/components/global/ResponsiveDialog';
import TooltipBasic from '@/components/global/TooltipBasic';
import AlertCard from '@/components/global/AlertCard';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Edit3Icon, Loader2Icon, SaveIcon } from 'lucide-react';
import { toast } from 'sonner';
import CustomDialog from '@/components/global/CustomDialog';

type Props = {
  initialDescription?: string;
};

export const EditDescriptionDialog = ({ initialDescription }: Props) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  return (
    <>
      <TooltipBasic
        element={
          <Button
            variant="default"
            className="w-full sm:w-auto"
            onClick={() => setIsEditOpen(true)}
          >
            <Edit3Icon /> Uredi
          </Button>
        }
        content="Izmeni opis organizacije"
        position="right"
      />

      <CustomDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Izmena opisa"
        className="sm:max-w-3xl"
      >
        <TooltipProvider>
          <EditDescriptionForm
            initialDescription={initialDescription}
            onCancel={() => setIsEditOpen(false)}
          />
        </TooltipProvider>
      </CustomDialog>
    </>
  );
};

type EditDescriptionFormProps = {
  initialDescription?: string;
  onCancel: () => void;
};

const EditDescriptionForm = ({ initialDescription, onCancel }: EditDescriptionFormProps) => {
  const form = useForm<EditDescriptionFormSchemaType>({
    resolver: zodResolver(editDescriptionFormSchema),
    defaultValues: {
      content: initialDescription || '',
    },
  });

  // Ovo je potrebno zbog tip tap editor-a
  const editorRef = useRef<Editor | null>(null);
  const handleCreate = useCallback(
    ({ editor }: { editor: Editor }) => {
      if (form.getValues('content') && editor.isEmpty) {
        editor.commands.setContent(form.getValues('content') ?? '');
      }
      editorRef.current = editor;
    },
    [form]
  );

  const onSubmit = async (values: EditDescriptionFormSchemaType) => {
    const { error } = await editProfileDescriptionAction(values);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Opis uspešno ažuriran.');
      onCancel();
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="flex flex-col gap-4">
      <AlertCard
        title="Napomena:"
        description="Opis će biti prikazan na Vašem profilu i vidljiv je svim korisnicima."
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    placeholder="Napišite nešto više o Vašoj organizaciji..."
                    onCreate={handleCreate}
                    editable={!isSubmitting}
                    editorClassName="focus:outline-hidden p-5 min-h-[200px]"
                    immediatelyRender={false}
                    autofocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col-reverse justify-end gap-2 md:flex-row">
            <Button type="button" variant="outline" className="w-full md:w-auto" onClick={onCancel}>
              Otkaži
            </Button>
            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={isSubmitting || form.watch('content') === (initialDescription ?? '')}
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Čuvanje
                </>
              ) : (
                <>
                  <SaveIcon />
                  Sačuvaj
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
