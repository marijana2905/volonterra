'use client';

import { HelpCircle } from 'lucide-react';
import { Legend, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export const description = 'A pie chart for answered vs unanswered questions';

type Props = {
  answeredCount: number;
  unansweredCount: number;
};

const chartConfig = {
  answered: {
    label: 'Odgovoreno',
    // tailwind sky-500 (matches completed)
    color: '#0ea5e9',
  },
  unanswered: {
    label: 'Nije odgovoreno',
    // tailwind red-500 (matches cancelled style)
    color: '#ef4444',
  },
} satisfies ChartConfig;

const QuestionsRadialChart = ({ answeredCount, unansweredCount }: Props) => {
  const totalQuestions = (answeredCount || 0) + (unansweredCount || 0);

  const data = [
    { name: chartConfig.answered.label, value: answeredCount, fill: chartConfig.answered.color },
    {
      name: chartConfig.unanswered.label,
      value: unansweredCount,
      fill: chartConfig.unanswered.color,
    },
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-4">
          <HelpCircle className="size-12" />
          <div className="flex flex-col gap-1">
            <CardTitle>Pitanja</CardTitle>
            <CardDescription>Ukupno pitanja: {totalQuestions.toLocaleString()}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 items-center pb-0">
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

export default QuestionsRadialChart;
