'use client';

import { useState } from 'react';
import { useCities } from '@/hooks/useCities';

import { cn } from '@/lib/utils';

import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from '@/components/ui/command';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Plus, Loader2 } from 'lucide-react';

type Props = {
  value: string | undefined;
  onChange: (value: string) => void;
};

export function CityCombobox({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isAddingCity, setIsAddingCity] = useState(false);

  const { cities, isLoading, addCity, refetch } = useCities();

  // Filter cities based on search input
  const filteredCities = cities.filter(
    (city: string) => city && city.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Check if current search value exists in cities
  const isNewCity =
    searchValue &&
    !cities.some((city: string) => city && city.toLowerCase() === searchValue.toLowerCase());

  const handleSelectCity = (selectedCity: string) => {
    onChange(selectedCity);
    setOpen(false);
    setSearchValue('');
  };

  const handleAddNewCity = async () => {
    if (!searchValue.trim() || isAddingCity) return;

    setIsAddingCity(true);
    try {
      const success = await addCity(searchValue.trim());
      if (success) {
        onChange(searchValue.trim());
        setOpen(false);
        setSearchValue('');
        refetch();
      }
    } catch (error) {
      console.error('Greska pri dodavanju novog grada:', error);
    } finally {
      setIsAddingCity(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="text-muted-foreground w-full justify-between"
        >
          {value ? value : 'Izaberi grad'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Pretraži grad..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading
                ? 'Učitavam gradove...'
                : searchValue
                  ? 'Grad nije pronađen.'
                  : 'Nema gradova.'}
            </CommandEmpty>

            {/* Show loading state */}
            {isLoading && (
              <CommandGroup>
                <CommandItem disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Učitavanje gradova...
                </CommandItem>
              </CommandGroup>
            )}

            {/* Show existing cities */}
            {!isLoading && filteredCities.length > 0 && (
              <CommandGroup heading="Postojeći gradovi">
                {filteredCities
                  .filter((city: string) => city) // Additional safety check
                  .map((city: string) => (
                    <CommandItem key={city} value={city} onSelect={() => handleSelectCity(city)}>
                      <Check
                        className={cn('mr-2 h-4 w-4', value === city ? 'opacity-100' : 'opacity-0')}
                      />
                      {city}
                    </CommandItem>
                  ))}
              </CommandGroup>
            )}

            {/* Show option to add new city */}
            {!isLoading && isNewCity && (
              <CommandGroup heading="Dodaj novi grad">
                <CommandItem
                  value={searchValue}
                  onSelect={handleAddNewCity}
                  disabled={isAddingCity}
                  className={cn(isAddingCity && 'cursor-not-allowed opacity-50')}
                >
                  {isAddingCity ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="mr-2 h-4 w-4" />
                  )}
                  {isAddingCity ? 'Dodavanje...' : `Dodaj "${searchValue}"`}
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
