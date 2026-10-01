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

const SelectStatus = () => {
  const { setSearchParam, removeSearchParam, getSearchParam } = useCustomSearchParams();

  const handleStatusChange = (value: string) => {
    if (value === 'default') {
      removeSearchParam('status');
    } else {
      setSearchParam('status', value);
    }
  };

  const currentValue = getSearchParam('status');
  const isFiltered = !!currentValue;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label>Status</Label>
        {isFiltered ? (
          <Button variant="ghost" size="sm" onClick={() => handleStatusChange('default')}>
            Poništi
          </Button>
        ) : null}
      </div>
      <Select onValueChange={handleStatusChange} value={currentValue || 'default'}>
        <SelectTrigger>
          <SelectValue placeholder="Izaberite status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="upcoming">Nadolazeće</SelectItem>
          <SelectItem value="active">U toku</SelectItem>
          <SelectItem value="completed">Završene</SelectItem>
          <SelectItem value="cancelled">Otkazane</SelectItem>
          <SelectItem value="default">Svi statusi</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectStatus;
