'use client';

import { useMemo } from 'react';
import { MultiSelect } from '@/components/global/MultiSelect';
import { useActionCategories } from '@/hooks/useActionCategories';
import { Label } from '@/components/ui/label';
import useCustomSearchParams from '@/hooks/useSearchParams';

const SelectCategory = () => {
  const { setSearchParam, removeSearchParam, getSearchParam } = useCustomSearchParams();

  const { data: categories, isLoading: isLoadingCategories } = useActionCategories();

  const options = useMemo(() => {
    if (!categories) return [];
    return categories.map(category => ({
      label: category.name,
      value: category.slug,
    }));
  }, [categories]);

  const defaultSelected = useMemo(() => {
    const raw = getSearchParam('categorySlug');
    if (!raw) return [] as string[];
    return raw
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
  }, [getSearchParam]);

  const handleChange = (values: string[]) => {
    if (!values || values.length === 0) {
      removeSearchParam('categorySlug', { replace: true, scroll: false });
      return;
    }
    setSearchParam('categorySlug', values.join(','), { replace: true, scroll: false });
  };

  return (
    <div>
      <Label>Kategorije</Label>

      <MultiSelect
        options={options}
        onValueChange={handleChange}
        defaultValue={defaultSelected}
        placeholder="Sve kategorije"
        variant="secondary"
        maxCount={2}
        disabled={isLoadingCategories}
      />
    </div>
  );
};

export default SelectCategory;
