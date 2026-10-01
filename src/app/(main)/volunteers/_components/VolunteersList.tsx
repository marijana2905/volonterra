import React from 'react';

import { Volunteer } from '@prisma/types';

import { PaginatedResponse } from '@/types/paginatedResponse.type';

import AlertCard from '@/components/global/AlertCard';
import VolunteerCard from './VolunteerCard';
import VolunteerCardSkeleton from './VolunteerCardSkeleton';

type VolunteersList = {
  data?: PaginatedResponse<Volunteer>;
  isLoading?: boolean;
  isError?: boolean;
};

const VolunteersList = ({ data, isLoading, isError }: VolunteersList) => {
  if (isLoading)
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <VolunteerCardSkeleton key={index} />
        ))}
      </div>
    );

  if (isError)
    return <AlertCard title="Greška prilikom pribavljanja volontera" variant="destructive" />;

  if (!data || data.items.length === 0) return <AlertCard title="Nema pronađenih volontera" />;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.items.map((volunteer, index) => (
        <VolunteerCard key={volunteer.userId} volunteer={volunteer} />
      ))}
    </div>
  );
};

export default VolunteersList;
