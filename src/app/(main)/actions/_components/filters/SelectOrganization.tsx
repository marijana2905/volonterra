import { useQuery } from '@tanstack/react-query';

import { OrganizerListItem } from '@/types/organizer.type';

import useCustomSearchParams from '@/hooks/useSearchParams';

import MyAvatar from '@/components/global/MyAvatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SelectOrganization = () => {
  const { setSearchParam, removeSearchParam, getSearchParam } = useCustomSearchParams();

  const { data } = useQuery<OrganizerListItem[]>({
    queryKey: ['organizations'],
    queryFn: async () => {
      const res = await fetch('/api/organizations');
      if (!res.ok) throw new Error('Failed to fetch organizations');
      return res.json();
    },
  });

  const handleOnValueChange = (value: string) => {
    if (value === 'default') {
      removeSearchParam('organizerUsername');
    } else {
      setSearchParam('organizerUsername', value);
    }
  };

  const currentOrganizer = getSearchParam('organizerUsername');
  const isFiltered = !!currentOrganizer;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label>Organizacija</Label>
        {isFiltered ? (
          <Button variant="ghost" size="sm" onClick={() => handleOnValueChange('default')}>
            Poništi
          </Button>
        ) : null}
      </div>
      <Select onValueChange={handleOnValueChange} value={currentOrganizer || 'default'}>
        <SelectTrigger>
          <SelectValue placeholder="Sve organizacije" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Sve organizacije</SelectItem>
          {data?.map((org, idx) => (
            <SelectItem key={idx} value={org.username}>
              <div className="flex min-w-0 items-center gap-2">
                <MyAvatar imageUrl={org.image} fallbackText="org" className="size-6" />
                <span className="truncate" title={org.organizationName}>
                  {org.organizationName}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectOrganization;
