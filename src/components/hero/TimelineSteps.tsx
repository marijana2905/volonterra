'use client';

import { CheckIcon } from 'lucide-react';
import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from '@/components/ui/timeline';

export type TimelineItemType = {
  id: number;
  title: string;
  description: string;
  completed?: boolean;
};

interface ReusableTimelineProps {
  items: TimelineItemType[];
  defaultValue?: number;
}

export default function ReusableTimeline({ items, defaultValue }: ReusableTimelineProps) {
  return (
    <Timeline defaultValue={defaultValue}>
      {items.map(item => (
        <TimelineItem
          key={item.id}
          step={item.id}
          className="group-data-[orientation=vertical]/timeline:ms-10"
          data-completed={item.completed}
        >
          <TimelineHeader>
            <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
            <TimelineTitle>{item.title}</TimelineTitle>
            <TimelineIndicator className="group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center group-data-completed/timeline-item:border-none group-data-[orientation=vertical]/timeline:-left-7">
              <CheckIcon className="group-not-data-completed/timeline-item:hidden" size={16} />
            </TimelineIndicator>
          </TimelineHeader>
          <TimelineContent>{item.description}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
