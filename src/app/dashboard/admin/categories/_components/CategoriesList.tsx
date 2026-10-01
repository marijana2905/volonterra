import React from 'react';

import { ActionCategoryWithCount } from '@/types/action-category.type';

import CategoryCard from '@/components/action-category/CategoryCard';
import AddCategoryButton from '@/components/action-category/AddCategoryButton';

type Props = {
  categories: ActionCategoryWithCount[];
};

const CategoriesList = ({ categories }: Props) => {
  return (
    <div className="flex flex-col gap-4">
      <AddCategoryButton />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {categories.map(category => (
          <CategoryCard
            key={category.id}
            category={category}
            readonly={false}
            hideChevron={false}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoriesList;
