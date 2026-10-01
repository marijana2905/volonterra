import { ActionListItem } from '@/types/action.type';
import React from 'react';
import ActionCard from './ActionCard';
import ActionCardSkeleton from './ActionCardSkeleton';
import AlertCard from '@/components/global/AlertCard';

type Props = {
  actions?: ActionListItem[];
  isLoading?: boolean;
};

const ActionsList = ({ actions, isLoading }: Props) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 lg:pr-4 lg:pb-4">
        {[...Array(5)].map((_, index) => (
          <ActionCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!actions || actions.length === 0) {
    return (
      <AlertCard title="Nema dostupnih akcija" description="Pokušajte prilagoditi svoje filtere." />
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:pr-4 lg:pb-4">
      {actions?.map(action => (
        <ActionCard key={action.id} action={action} />
      ))}
    </div>
  );
};

export default ActionsList;
