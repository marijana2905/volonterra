import AlertCard from '@/components/global/AlertCard';
import OrganizerCard from '@/components/global/OrganizerCard';
import { getOrganizers } from '@/data/organizer/getOrganizers';
import React from 'react';

const OrganizationsList = async () => {
  const organizers = await getOrganizers();

  return (
    <>
      {organizers.length ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {organizers.map(organizer => (
            <OrganizerCard key={organizer.userId} organizer={organizer} />
          ))}
        </div>
      ) : (
        <AlertCard title="Trenutno nema organizacija za prikaz" />
      )}
    </>
  );
};

export default OrganizationsList;
