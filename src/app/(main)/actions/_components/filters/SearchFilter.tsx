'use client';

import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import useCustomSearchParams from '@/hooks/useSearchParams';
import { SearchIcon, XIcon } from 'lucide-react';
import { useState, useEffect, ChangeEvent, useRef } from 'react';

const SearchFilter = () => {
  const { getSearchParam, setSearchParam, removeSearchParam } = useCustomSearchParams();

  const [searchTerm, setSearchTerm] = useState(getSearchParam('search') || '');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const setSearchParamRef = useRef(setSearchParam);
  const removeSearchParamRef = useRef(removeSearchParam);

  useEffect(() => {
    setSearchParamRef.current = setSearchParam;
    removeSearchParamRef.current = removeSearchParam;
  }, [setSearchParam, removeSearchParam]);

  useEffect(() => {
    const value = debouncedSearch?.trim();
    if (value) {
      setSearchParamRef.current('search', value);
    } else {
      removeSearchParamRef.current('search');
    }
  }, [debouncedSearch]);

  useEffect(() => {
    const currentParam = getSearchParam('search') ?? '';
    setSearchTerm((prev) => (prev === currentParam ? prev : currentParam));
  }, [getSearchParam]);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative w-full">
      <Input
        type="search"
        value={searchTerm}
        onChange={handleOnChange}
        placeholder="Pretraga..."
        className="w-full px-9"
      />

      <SearchIcon className="text-muted-foreground/60 absolute top-2 left-2" size={20} />

      {searchTerm && (
        <XIcon
          className="text-muted-foreground/60 absolute top-2 right-2"
          size={20}
          onClick={() => setSearchTerm('')}
        />
      )}
    </div>
  );
};

export default SearchFilter;
