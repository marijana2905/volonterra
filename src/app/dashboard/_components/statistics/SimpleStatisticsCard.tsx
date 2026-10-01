import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

type Props = {
  title: string;
  value: number | string;
  icon: LucideIcon;
};

const SimpleStatisticsCard = ({ title, value, icon: Icon }: Props) => {
  return (
    <Card className="w-full">
      <CardContent className="bg-card flex items-center gap-6 rounded-xl">
        <Icon className="size-12 flex-shrink-0" />

        <div className="flex flex-col justify-center">
          <div>{title}</div>
          <span className="text-4xl">{value}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleStatisticsCard;
