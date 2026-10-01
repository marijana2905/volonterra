import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useCustomSearchParams from '@/hooks/useSearchParams';
import { useQuery } from '@tanstack/react-query';

const SelectCity = () => {
  const { setSearchParam, removeSearchParam, getSearchParam } = useCustomSearchParams();

  const { data, isLoading, isError } = useQuery<{
    cities: string[] | null;
    error: string | null;
  }>({
    queryKey: ['cities'],
    queryFn: async () => {
      const res = await fetch('/api/city/all');
      if (!res.ok) throw new Error('Failed to fetch cities');
      return res.json();
    },
  });

  const handleOnValueChange = (value: string) => {
    if (value === 'default') {
      removeSearchParam('city');
    } else {
      setSearchParam('city', value);
    }
  };

  const currentCity = getSearchParam('city');
  const isFiltered = !!currentCity;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label>Grad</Label>
        {isFiltered ? (
          <Button variant="ghost" size="sm" onClick={() => handleOnValueChange('default')}>
            Poništi
          </Button>
        ) : null}
      </div>
      <Select onValueChange={handleOnValueChange} value={currentCity || 'default'}>
        <SelectTrigger>
          <SelectValue placeholder="Svi gradovi" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Svi gradovi</SelectItem>
          {data?.cities?.map((city, idx) => (
            <SelectItem key={idx} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectCity;
