'use client';

import React, { useCallback, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2Icon, PhoneIcon, SaveIcon, UserIcon } from 'lucide-react';
import { FaFacebook, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import { toast } from 'sonner';

import { Volunteer } from '@prisma/types';

import { editProfileAction } from '@/actions/volunteer/editProfile.action';
import { MinimalTiptapEditor } from '@/components/minimal-tiptap';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  volunteerProfileSchema,
  VolunteerProfileSchemaType,
} from '@/schemas/volunteerProfileSchema';

type EditVolunteerProfileFormProps = {
  data: Volunteer;
};

const EditVolunteerProfileForm = ({ data }: EditVolunteerProfileFormProps) => {
  const form = useForm<VolunteerProfileSchemaType>({
    resolver: zodResolver(volunteerProfileSchema),
    defaultValues: {
      bio: data.bio || '',
      phone: data.phone || '',
      facebookLink: data.facebookLink || '',
      instagramLink: data.instagramLink || '',
      xLink: data.xLink || '',
    },
  });

  // Ovo je potrebno zbog tip tap editor-a
  const editorRef = useRef<Editor | null>(null);
  const handleCreate = useCallback(
    ({ editor }: { editor: Editor }) => {
      if (form.getValues('bio') && editor.isEmpty) {
        editor.commands.setContent(form.getValues('bio') ?? '');
      }
      editorRef.current = editor;
    },
    [form],
  );

  const isPending = form.formState.isSubmitting;

  async function onSubmit(values: VolunteerProfileSchemaType) {
    const { error } = await editProfileAction(values);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Uspešno ste izmenili profil');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <UserIcon size={18} /> Biografija
              </FormLabel>
              <FormControl className="w-full overflow-auto">
                <MinimalTiptapEditor
                  {...field}
                  throttleDelay={0}
                  className={cn('w-full', {
                    'border-destructive focus-within:border-destructive': form.formState.errors.bio,
                  })}
                  output="html"
                  placeholder="Napišite nešto o sebi..."
                  onCreate={handleCreate}
                  editable={!isPending}
                  editorClassName="focus:outline-hidden p-5 min-h-[200px]"
                  immediatelyRender={false}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="w-full md:w-fit">
                <FormLabel className="flex items-center gap-2">
                  <PhoneIcon size={18} /> Broj telefona
                </FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="facebookLink"
            render={({ field }) => (
              <FormItem className="w-full md:w-fit">
                <FormLabel className="flex items-center gap-2">
                  <FaFacebook size={18} /> Facebook profil
                </FormLabel>
                <FormControl>
                  <Input type="url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
          <FormField
            control={form.control}
            name="xLink"
            render={({ field }) => (
              <FormItem className="w-full md:w-fit">
                <FormLabel className="flex items-center gap-2">
                  <FaXTwitter size={18} /> X(Twitter) profil
                </FormLabel>
                <FormControl>
                  <Input type="url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instagramLink"
            render={({ field }) => (
              <FormItem className="w-full md:w-fit">
                <FormLabel className="flex items-center gap-2">
                  <FaInstagram size={18} /> Instagram profil
                </FormLabel>
                <FormControl>
                  <Input type="url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending || form.formState.isDirty === false}>
          {isPending ? <Loader2Icon className="animate-spin" /> : <SaveIcon />}
          Sačuvaj izmene
        </Button>
      </form>
    </Form>
  );
};

export default EditVolunteerProfileForm;
