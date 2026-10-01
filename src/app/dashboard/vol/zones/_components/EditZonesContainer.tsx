import { Zone } from '@/types/zones.type';

import ZoneDialog from './ZoneDialog';
import MapWithZonesWrapper from './MapWithZonesWrapper';

import { Card, CardHeader } from '@/components/ui/card';
import AlertCard from '@/components/global/AlertCard';

type Props = {
  zones: Zone[];
};

const EditZonesContainer = ({ zones }: Props) => {
  return (
    <div className="flex h-full flex-col gap-4 md:px-8">
      <div className="flex justify-end">
        <ZoneDialog />
      </div>

      <div className="flex h-full flex-1 flex-col gap-4 lg:flex-row">
        {/* leva strana  */}
        <div className="flex w-full flex-col gap-4 lg:w-4/12">
          {zones.length === 0 ? (
            <AlertCard title="Nema zona za prikaz" />
          ) : (
            zones.map(zone => (
              <Card key={zone.id} className="p-0 shadow-none">
                {/* TODO: kada se klikne na zone.name mozda da se zumira mapa na tu zonu konkretno */}
                <CardHeader className="flex items-center justify-between gap-2 p-4">
                  <div className="flex flex-col">
                    <span>{zone.name}</span>
                    <span className="text-muted-foreground text-xs">Opseg: {zone.radius} km</span>
                  </div>
                  <ZoneDialog zone={zone} />
                </CardHeader>
              </Card>
            ))
          )}
        </div>

        {/* desna strana */}
        <div className="flex h-[500px] w-full lg:h-full lg:w-8/12">
          <MapWithZonesWrapper zones={zones} />
        </div>
      </div>
    </div>
  );
};

export default EditZonesContainer;
