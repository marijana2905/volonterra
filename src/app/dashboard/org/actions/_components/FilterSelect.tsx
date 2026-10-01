'use client';

import { startTransition, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { ActionStatusExtended } from '@/types/action.type';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { BarLoader } from 'react-spinners';

const statuses: { value: ActionStatusExtended; label: string }[] = [
  { value: 'ALL', label: 'Sve' },
  { value: 'UPCOMING', label: 'Predstojeće' },
  { value: 'ONGOING', label: 'U toku' },
  { value: 'CANCELLED', label: 'Otkazane' },
  { value: 'COMPLETED', label: 'Završene' },
  { value: 'APPROVAL_NEEDED', label: 'Potrebna potvrda' },
];

const FilterSelect = ({ current }: { current: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleChange = (value: ActionStatusExtended) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'ALL') {
        params.delete('status');
      } else {
        params.set('status', value);
      }

      router.replace(`?${params.toString()}`);
    });
  };

  return (
    <>
      <Select value={current} onValueChange={handleChange}>
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {statuses.map(s => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isPending && (
        <div className="fixed top-16 right-0 w-full rounded-t-md md:rounded-t-xl">
          <BarLoader width="100%" color="green" loading={isPending} />
        </div>
      )}
    </>
  );
};

export default FilterSelect;
