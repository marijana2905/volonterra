'use client';

import { PickaxeIcon } from 'lucide-react';
import { Legend, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  upcoming: {
    label: 'Nadolazeće',
    // tailwind amber-500
    color: '#f59e0b',
  },
  ongoing: {
    label: 'U toku',
    // tailwind emerald-500
    color: '#10b981',
  },
  approvalNeeded: {
    label: 'Potrebna potvrda',
    // tailwind violet-500
    color: '#8b5cf6',
  },
  completed: {
    label: 'Završene',
    // tailwind sky-500
    color: '#0ea5e9',
  },
  cancelled: {
    label: 'Otkazane',
    // tailwind red-500
    color: '#ef4444',
  },
} satisfies ChartConfig;

type Props = {
  upcomingCount: number;
  ongoingCount: number;
  approvalNeededCount: number;
  completedCount: number;
  cancelledCount: number;
};

const ActionsPieChart = ({
  upcomingCount,
  ongoingCount,
  approvalNeededCount,
  completedCount,
  cancelledCount,
}: Props) => {
  const total =
    upcomingCount + ongoingCount + approvalNeededCount + completedCount + cancelledCount;

  const data = [
    { name: chartConfig.upcoming.label, value: upcomingCount, fill: chartConfig.upcoming.color },
    { name: chartConfig.ongoing.label, value: ongoingCount, fill: chartConfig.ongoing.color },
    {
      name: chartConfig.approvalNeeded.label,
      value: approvalNeededCount,
      fill: chartConfig.approvalNeeded.color,
    },
    { name: chartConfig.completed.label, value: completedCount, fill: chartConfig.completed.color },
    { name: chartConfig.cancelled.label, value: cancelledCount, fill: chartConfig.cancelled.color },
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-4">
          <PickaxeIcon className="size-12" />
          <div className="flex flex-col gap-1">
            <CardTitle>Stanje akcija</CardTitle>
            <CardDescription>Ukupno akcija: {total}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="mx-auto h-96 w-full max-w-[420px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="value" nameKey="name" />
            <Legend verticalAlign="bottom" align="center" iconType="circle" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ActionsPieChart;
