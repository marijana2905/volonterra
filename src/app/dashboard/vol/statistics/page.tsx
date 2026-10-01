import React from 'react';

import { requireVolunteer } from '@/data/auth/requireVolunteer';
import { getActionsPerMonth } from '@/data/volunteer/getActionsPerMonth';
import { getVolunteerStatistics } from '@/data/volunteer/getVolunteerStatistics';
import { getVolunteerData } from '@/data/volunteer/getVolunteerData';

import BreadcrumbWrapper from '@/components/global/BreadcrumbWrapper';
import SimpleStatisticsCard from '@/app/dashboard/_components/statistics/SimpleStatisticsCard';
import ActionsPerMonth from './_components/ActionsPerMonth';
import AlertCard from '@/components/global/AlertCard';

import { MapPin, Users, PenLine, HelpCircle, PickaxeIcon, CoinsIcon } from 'lucide-react';
import Image from 'next/image';
import { badgeNames, badgeRules } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const VolunteerStatisticPage = async () => {
  const session = await requireVolunteer();

  const [stats, actionsPerMonth, volunteer] = await Promise.all([
    getVolunteerStatistics(),
    getActionsPerMonth(),
    getVolunteerData(session.user.id),
  ]);

  const volunteerPoints = volunteer
    ? { workedHours: volunteer.workedHours, badgeLevel: volunteer.badgeLevel }
    : null;

  return (
    <section className="flex flex-col gap-4 p-4">
      <BreadcrumbWrapper items={[{ label: 'Statistika' }]} homeHref="/dashboard/vol/statistics" />

      {!volunteer ? (
        <div className="flex flex-col gap-4 md:px-8">
          <AlertCard variant="destructive" title="Nije moguće učitati podatke volontera." />
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:px-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            <SimpleStatisticsCard
              title="Broj prijava na akcije:"
              value={stats.participationsCount}
              icon={PickaxeIcon}
            />
            <SimpleStatisticsCard
              title="Moji timovi:"
              value={stats.createdTeamsCount}
              icon={Users}
            />
            <SimpleStatisticsCard
              title="Članstva u timovima:"
              value={stats.teamMembershipsCount}
              icon={Users}
            />
            <SimpleStatisticsCard
              title="Zone interesa:"
              value={stats.interestZoneCount}
              icon={MapPin}
            />
            <SimpleStatisticsCard
              title="Objavljeni blogovi:"
              value={stats.postsCount}
              icon={PenLine}
            />
            <SimpleStatisticsCard
              title="Postavljena pitanja:"
              value={stats.questionsCount}
              icon={HelpCircle}
            />
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="flex flex-row gap-4 md:w-2/5 md:flex-col">
              <SimpleStatisticsCard
                title="Osvojeni bodovi:"
                value={volunteerPoints?.workedHours.toString() ?? '0'}
                icon={CoinsIcon}
              />
              <Card className="flex w-1/2 items-center gap-2 md:w-full">
                <Badge>
                  {badgeRules[(volunteerPoints?.badgeLevel ?? 0) - 1] || ''}
                  {volunteerPoints?.badgeLevel === 1 ? 'Dobrodošli!' : '+ odrađenih akcija'}
                </Badge>
                <Image
                  src={`/badges/Bedz_${volunteerPoints?.badgeLevel ?? 0}.png`}
                  alt={'Badge Image'}
                  width={164}
                  height={164}
                />
                <span className="text-xl">
                  {typeof volunteerPoints?.badgeLevel === 'number' && volunteerPoints.badgeLevel > 0
                    ? (badgeNames[volunteerPoints.badgeLevel - 1] ?? '')
                    : ''}
                </span>
              </Card>
            </div>

            <div className="w-full md:w-3/5">
              <ActionsPerMonth data={actionsPerMonth} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default VolunteerStatisticPage;
