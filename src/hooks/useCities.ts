import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

const CITIES_QUERY_KEY = ['cities'];

async function fetchCities(): Promise<string[]> {
  const response = await fetch('/api/city/all');

  if (!response.ok) {
    throw new Error('Greška pri učitavanju gradova');
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data.cities;
}

async function addCityRequest(cityName: string): Promise<string> {
  const response = await fetch('/api/city', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cityName }),
  });

  if (!response.ok) {
    throw new Error('Greška pri dodavanju grada');
  }

  const data = await response.json();
  return data.city;
}

export function useCities() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: cities = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: CITIES_QUERY_KEY,
    queryFn: fetchCities,
  });

  const addCityMutation = useMutation({
    mutationFn: addCityRequest,
    onSuccess: (newCity) => {
      queryClient.setQueryData<string[]>(CITIES_QUERY_KEY, (oldCities = []) => [
        ...oldCities,
        newCity,
      ]);
      toast.success('Grad je uspešno dodat');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Greška pri dodavanju grada');
    },
  });

  useEffect(() => {
    if (isError && error) {
      toast.error(error.message || 'Greška pri učitavanju gradova');
      router.back();
    }
  }, [isError, error, router]);

  const addCity = async (cityName: string): Promise<boolean> => {
    try {
      await addCityMutation.mutateAsync(cityName);
      return true;
    } catch {
      return false;
    }
  };

  return {
    cities,
    isLoading,
    addCity,
    refetch,
  };
}
