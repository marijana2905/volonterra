'use client';

import { useMemo } from 'react';

import { Bar, BarChart, XAxis, YAxis } from 'recharts';

import { formatMonthLabel } from '@/lib/utils';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';

type ChartDataPoint = {
  date: string;
  applied: number;
  attended: number;
  cancelled: number;
  monthLabel?: string;
};

type ActionsPerMonthProps = {
  data: ChartDataPoint[];
};

const chartConfig = {
  applied: {
    label: 'Prijavljeni',
    color: 'var(--chart-4)',
  },
  attended: {
    label: 'Prisustvovali',
    color: 'var(--chart-1)',
  },
  cancelled: {
    label: 'Otkazani',
    color: 'var(--destructive)',
  },
} satisfies ChartConfig;

const ActionsPerMonth = ({ data }: ActionsPerMonthProps) => {
  const chartData = useMemo(
    () =>
      data.map(entry => ({
        ...entry,
        monthLabel: formatMonthLabel(entry.date),
      })),
    [data]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Akcije po mesecima</CardTitle>
        <CardDescription>
          Broj akcija u kojima ste učestvovali tokom protekle godine
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={formatMonthLabel}
            />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={24} />
            <Bar dataKey="applied" stackId="participations" fill="var(--color-applied)" />
            <Bar dataKey="attended" stackId="participations" fill="var(--color-attended)" />
            <Bar
              dataKey="cancelled"
              stackId="participations"
              fill="var(--color-cancelled)"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="dot" labelKey="monthLabel" />}
              cursor={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ActionsPerMonth;
