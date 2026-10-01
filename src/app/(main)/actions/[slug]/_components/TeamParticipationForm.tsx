'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/lib/auth-client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import AlertCard from '@/components/global/AlertCard';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { createTeamParticipationAction } from '@/actions/participation/createTeamParticipation.actions';
import { toast } from 'sonner';
import { BarLoader } from 'react-spinners';
import { participationKeys } from '@/hooks/useParticipation';

const teamParticipationFormSchema = z.object({
  teamId: z.string().min(1, 'Morate izabrati tim'),
});

type TeamParticipationFormSchemaType = z.infer<typeof teamParticipationFormSchema>;

type TeamSelectOption = {
  id: string;
  name: string;
};

type FetchTeamsResponseType = {
  success: boolean;
  data: TeamSelectOption[];
};

type TeamParticipationFormProps = {
  actionId: string;
  setIsOpen: (isOpen: boolean) => void;
};

const TeamParticipationForm = ({ actionId, setIsOpen }: TeamParticipationFormProps) => {
  const session = useSession();
  const userId = session.data?.user.id;

  const queryClient = useQueryClient();

  if (session.isPending) {
    return <div>Učitavanje...</div>;
  }

  if (!userId) {
    return <AlertCard title="Morate biti ulogovani da biste prijavili tim" variant="destructive" />;
  }

  // Fetch my teams for select items
  const { data: myTeams } = useQuery({
    queryKey: ['user-teams', userId],
    queryFn: async ({ signal }) => {
      const res = await fetch(`/api/volunteer/${userId}/teams`, {
        method: 'GET',
        signal,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Greška prilikom pribavljanja timova: ${res.status} ${text}`);
      }

      const data = (await res.json()) as FetchTeamsResponseType;

      if (!data.success) {
        throw new Error(`Greška prilikom pribavljanja timova.`);
      }

      return data.data;
    },
    enabled: !!userId,
  });

  // Form
  const form = useForm<TeamParticipationFormSchemaType>({
    resolver: zodResolver(teamParticipationFormSchema),
    defaultValues: { teamId: '' },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: TeamParticipationFormSchemaType) => {
    const { error } = await createTeamParticipationAction(actionId, values.teamId, userId);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Uspešno ste prijavili tim na akciju');
      setIsOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: participationKeys.check(actionId, userId) }); // Invalidate check participation query to refetch and show that user is now participating
      queryClient.invalidateQueries({ queryKey: ['notifications'] }); // Invalidate notifications
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="teamId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tim</FormLabel>
              <FormControl className="w-full overflow-auto">
                <Select value={field.value} onValueChange={value => field.onChange(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Izaberite tim" />
                  </SelectTrigger>
                  <SelectContent>
                    {myTeams?.map(team => {
                      return (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            Prijavi
          </Button>
        </div>

        <div className="absolute top-0 left-0 w-full">
          <BarLoader color="green" width={'100%'} loading={isSubmitting} />
        </div>
      </form>
    </Form>
  );
};

export default TeamParticipationForm;
