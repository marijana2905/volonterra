'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from '@/lib/auth-client';
import { createIndividualParticipation } from '@/actions/participation/createIndividualParticipation';
import { toast } from 'sonner';

interface ParticipationCheckResponse {
  success: boolean;
}

// Query key factory for participation-related queries
export const participationKeys = {
  all: ['participation'] as const,
  check: (actionId: string, userId?: string) =>
    [...participationKeys.all, 'check', actionId, userId] as const,
  byAction: (actionId: string) => [...participationKeys.all, 'byAction', actionId] as const,
  byUser: (userId: string) => [...participationKeys.all, 'byUser', userId] as const,
};

// API function to check participation status
const checkParticipationStatus = async (actionId: string): Promise<ParticipationCheckResponse> => {
  const res = await fetch('/api/participation/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actionId }),
  });

  if (!res.ok) {
    throw new Error('Failed to check participation status');
  }

  return res.json();
};

export const useParticipation = (actionId: string) => {
  const session = useSession();
  const queryClient = useQueryClient();

  // Query to check if user is already participating
  const participationQuery = useQuery({
    queryKey: participationKeys.check(actionId, session.data?.user.id),
    queryFn: () => checkParticipationStatus(actionId),
    enabled: !!(session.data?.user.id && session.data?.user.role === 'VOLUNTEER'),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  // Mutation to create individual participation
  const participationMutation = useMutation({
    mutationFn: async () => {
      if (!session.data?.user.id) {
        throw new Error('User not authenticated');
      }
      return createIndividualParticipation(actionId, session.data.user.id);
    },
    onSuccess: data => {
      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success('Prijava uspešna', {
        description: 'Otkazivanje prijave je moguće u narednih 24h.',
      });

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: participationKeys.check(actionId, session.data?.user.id),
      });
      queryClient.invalidateQueries({
        queryKey: participationKeys.byAction(actionId),
      });
      if (session.data?.user.id) {
        queryClient.invalidateQueries({
          queryKey: participationKeys.byUser(session.data.user.id),
        });
      }
    },
    onError: error => {
      toast.error(error.message || 'Greška prilikom prijave');
    },
  });

  // Future: Mutation to cancel participation
  const cancelParticipationMutation = useMutation({
    mutationFn: async () => {
      if (!session.data?.user.id) {
        throw new Error('User not authenticated');
      }
      // TODO: Implement cancel participation action
      throw new Error('Cancel functionality not yet implemented');
    },
    onSuccess: () => {
      toast.success('Prijava je uspešno otkazana');

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: participationKeys.check(actionId, session.data?.user.id),
      });
      queryClient.invalidateQueries({
        queryKey: participationKeys.byAction(actionId),
      });
      if (session.data?.user.id) {
        queryClient.invalidateQueries({
          queryKey: participationKeys.byUser(session.data.user.id),
        });
      }
    },
    onError: error => {
      toast.error(error.message || 'Greška prilikom otkazivanja prijave');
    },
  });

  // Computed states
  const isLoading = session.isPending || participationQuery.isLoading;
  const isParticipating = participationQuery.data?.success ?? false;
  const canParticipate = session.data?.user.role === 'VOLUNTEER' && !isParticipating;
  const isSubmitting = participationMutation.isPending || cancelParticipationMutation.isPending;
  const canCancel = isParticipating && !isSubmitting;

  return {
    // States
    isLoading,
    isParticipating,
    canParticipate,
    canCancel,
    isSubmitting,
    session,

    // Data
    participationData: participationQuery.data,

    // Actions
    participate: participationMutation.mutate,
    cancelParticipation: cancelParticipationMutation.mutate,

    // Query states for advanced usage
    participationQuery,
    participationMutation,
    cancelParticipationMutation,

    // Utils
    refetchParticipation: participationQuery.refetch,

    // Error states
    participationError: participationMutation.error,
    cancelError: cancelParticipationMutation.error,
  };
};

export default useParticipation;
