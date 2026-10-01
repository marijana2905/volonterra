'use client';

import { useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Editor } from '@tiptap/react';
import { MinimalTiptapEditor } from '@/components/minimal-tiptap';

import { Team } from '@prisma/types';
import { editTeamAction } from '@/actions/team/editTeam.action';
import { createTeamAction } from '@/actions/team/createTeam.action';

import { teamFormSchema, TeamFormSchemaType } from '@/schemas/teamSchema';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/lib/utils';
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
import { PlusIcon, SaveIcon } from 'lucide-react';
import { toast } from 'sonner';
import { BarLoader } from 'react-spinners';
import { TeamWithMembers } from '@/types/team.type';

type Props = {
  onSuccess: () => void;
  team?: TeamWithMembers;
};

const TeamForm = ({ onSuccess, team }: Props) => {
  const form = useForm<TeamFormSchemaType>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: team?.name || '',
      bio: team?.bio || '',
    },
  });

  const isSubmitting = form.formState.isSubmitting;

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

  async function onSubmit(values: TeamFormSchemaType) {
    const { error } = team ? await editTeamAction(values, team.id) : await createTeamAction(values);

    if (error) {
      toast.error(error);
    } else {
      toast.success(team ? 'Tim uspešno izmenjen!' : 'Tim uspešno kreiran!');
      onSuccess();
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Naziv</FormLabel>
                <FormControl>
                  <Input placeholder="Unesite ime tima..." {...field} disabled={isSubmitting} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biografija (opciono)</FormLabel>
                <FormControl className="w-full overflow-auto">
                  <MinimalTiptapEditor
                    {...field}
                    throttleDelay={0}
                    className={cn('w-full', {
                      'border-destructive focus-within:border-destructive':
                        form.formState.errors.bio,
                    })}
                    output="html"
                    placeholder="Recite nešto o vašem timu..."
                    onCreate={handleCreate}
                    editable={!isSubmitting}
                    editorClassName="focus:outline-hidden p-5 min-h-[200px]"
                    immediatelyRender={false}
                    autofocus={false}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit">
              {team ? (
                <>
                  <SaveIcon />
                  Sačuvaj
                </>
              ) : (
                <>
                  <PlusIcon />
                  Kreiraj
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>

      <div className="absolute top-0 left-0 w-full">
        <BarLoader color="green" width={'100%'} loading={isSubmitting} />
      </div>
    </div>
  );
};

export default TeamForm;
