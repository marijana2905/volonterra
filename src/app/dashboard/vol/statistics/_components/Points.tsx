'use client';

import { CoinsIcon } from 'lucide-react';

type VolunteerPoints = {
  workedHours: number;
};

type PointsProps = {
  points: VolunteerPoints | null;
};

export default function Points({ points }: PointsProps) {
  if (!points) return <p>Volonter nije pronađen.</p>;

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-muted-foreground text-sm">Poeni volontera:</p>
      <div className="flex items-center gap-1 text-lg font-semibold">
        {points.workedHours}
        <CoinsIcon className="h-5 w-5 text-yellow-500" />
      </div>
    </div>
  );
}
