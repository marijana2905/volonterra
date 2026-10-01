'use client';

import { ActionCategoryWithCount } from '@/types/action-category.type';
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRightIcon, Edit3Icon, FolderOpenIcon } from 'lucide-react';
import CustomDialog from '@/components/global/CustomDialog';
import { useRouter } from 'next/navigation';
import CategoryForm from './CategoryForm';

type Props = {
  category: ActionCategoryWithCount;
  readonly?: boolean;
  hideChevron?: boolean;
};

const CategoryCard = ({ category, readonly, hideChevron }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <Card
        className="group relative flex h-full cursor-pointer flex-col"
        onClick={() => {
          if (readonly) {
            router.push(`/actions?categorySlug=${category.slug}`);
          } else {
            setIsDialogOpen(true);
          }
        }}
      >
        <div className="from-primary/10 to-accent/10 pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-tr opacity-0 transition group-hover:opacity-100" />

        <CardHeader className="flex flex-col items-start pb-2">
          <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-muted mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition">
            <FolderOpenIcon className="h-6 w-6" />
          </div>
          <CardTitle className="text-foreground group-hover:text-primary mb-2 text-lg transition">
            {category.name}
          </CardTitle>
          <CardDescription>
            {category.description || 'Nema opisa za ovu kategoriju.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-auto flex items-center justify-between pt-0">
          <span className="text-muted-foreground text-sm">
            {category.count ?? 0} {category.count === 1 ? 'akcija' : 'akcije'}
          </span>

          {hideChevron && (
            <span className="group-hover:text-primary absolute top-6 right-6 text-gray-300 transition dark:text-gray-500">
              <ChevronRightIcon className="h-6 w-6" />
            </span>
          )}
        </CardContent>
      </Card>

      <CustomDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        title={`Izmena kategorije: ${category.name}`}
        icon={Edit3Icon}
        className="sm:max-w-2xl"
      >
        <CategoryForm category={category} onClose={() => setIsDialogOpen(false)} />
      </CustomDialog>
    </>
  );
};

export default CategoryCard;
