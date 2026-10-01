'use client';

import React from 'react';
import {
  Users,
  Building2,
  PickaxeIcon,
  FileText,
  BuildingIcon,
  UsersIcon,
  FileTextIcon,
} from 'lucide-react';
import SimpleStatisticsCard from '../../_components/statistics/SimpleStatisticsCard';

type Props = {
  stats: {
    volunteers: number;
    organizers: number;
    actions: number;
    blogs: number;
  };
};

const Statistic = ({ stats }: Props) => {
  const items = [
    {
      title: 'Volonteri',
      value: stats.volunteers,
      icon: UsersIcon,
    },
    {
      title: 'Organizacije',
      value: stats.organizers,
      icon: BuildingIcon,
    },
    {
      title: 'Akcije',
      value: stats.actions,
      icon: PickaxeIcon,
    },
    {
      title: 'Blogovi',
      value: stats.blogs,
      icon: FileTextIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(item => (
        <SimpleStatisticsCard
          key={item.title}
          title={item.title}
          value={item.value}
          icon={item.icon}
        />
      ))}
    </div>
  );
};

export default Statistic;
