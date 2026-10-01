'use client';

import React, { useState } from 'react';

import CategoryForm from '@/components/action-category/CategoryForm';
import CustomDialog from '@/components/global/CustomDialog';
import { Button } from '@/components/ui/button';

import { FolderPlusIcon, PlusIcon } from 'lucide-react';

const AddCategoryButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button className="ml-auto w-fit" onClick={() => setIsDialogOpen(true)}>
        <PlusIcon /> Dodaj kategoriju
      </Button>

      <CustomDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        title="Nova kategorija akcija"
        icon={FolderPlusIcon}
      >
        <CategoryForm onClose={() => setIsDialogOpen(false)} />
      </CustomDialog>
    </>
  );
};

export default AddCategoryButton;
