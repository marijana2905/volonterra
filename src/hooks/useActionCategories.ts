'use client';

import { ActionCategory } from '@prisma/types';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function useActionCategories() {
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['action-categories'],
    queryFn: async () => {
      const response = await fetch('/api/action-category/all');

      if (!response.ok) {
        throw new Error('Greška pri učitavanju kategorija');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data.categories as ActionCategory[];
    },
  });

  // Error handling for categories fetch
  useEffect(() => {
    if (isError && error) {
      toast.error(error.message || 'Greška pri učitavanju kategorija');
      router.back();
    }
  }, [isError, error]);

  return {
    data,
    isLoading,
  };
}
