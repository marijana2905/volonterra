'use client';

import React, { useState } from 'react';

import { ActionImpression } from '@prisma/types';

import CustomDialog from '@/components/global/CustomDialog';
import { Button } from '@/components/ui/button';
import ImpressionForm from './ImpressionForm';

import { MessageCirclePlusIcon } from 'lucide-react';

type Props = {
  actionId: string;
  impression?: ActionImpression;
};

const ImpressionFormTrigger = ({ actionId, impression }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>
        <MessageCirclePlusIcon /> Ostavi utisak
      </Button>

      <CustomDialog
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        title="Ostavi utisak o akciji"
        description="Podeli svoje iskustvo i utiske o akciji sa drugima."
      >
        <ImpressionForm
          actionId={actionId}
          impression={impression}
          onClose={() => setIsModalOpen(false)}
        />
      </CustomDialog>
    </div>
  );
};

export default ImpressionFormTrigger;
