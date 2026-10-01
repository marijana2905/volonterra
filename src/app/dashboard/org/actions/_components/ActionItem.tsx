import { ActionStatus } from '@prisma/types';
import { cn, formatDate, isApprovalNeeded, isCurrentlyActiveAction } from '@/lib/utils';
import { ActionDashboard } from '@/types/action.type';

import ActionDropdown from './ActionDropdown';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, TagIcon, Users } from 'lucide-react';
import Link from 'next/link';

type Props = {
  action: ActionDashboard;
};

const ActionItem = ({ action }: Props) => {
  const approveNeed = isApprovalNeeded(action.fullDateTo, action.status);
  const currentlyActive = isCurrentlyActiveAction(
    action.fullDateFrom,
    action.fullDateTo,
    action.status,
  );

  const getBadgeVariant = (status: ActionStatus) => {
    if (approveNeed) {
      return 'destructive';
    }

    if (currentlyActive) {
      return 'default';
    }

    switch (status) {
      case ActionStatus.CREATED:
        return 'outline';
      case ActionStatus.CANCELLED:
        return 'outline';
      case ActionStatus.COMPLETED:
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: ActionStatus) => {
    if (approveNeed) {
      return 'Potrebna potvrda';
    }

    if (currentlyActive) {
      return 'U toku';
    }

    switch (status) {
      case ActionStatus.CREATED:
        return 'Kreirana';
      case ActionStatus.CANCELLED:
        return 'Otkazana';
      case ActionStatus.COMPLETED:
        return 'Završena';
      default:
        return 'Nepoznato';
    }
  };

  const getCardClassName = () => {
    if (approveNeed) {
      return 'border-destructive border-2 bg-destructive/5';
    }

    if (currentlyActive) {
      return 'border-primary border-2 bg-primary/5';
    }

    switch (action.status) {
      case ActionStatus.COMPLETED:
        return 'border-green-500 bg-green-50 dark:bg-green-950/20';
      case ActionStatus.CANCELLED:
        return 'border-muted bg-muted/30';
      default:
        return '';
    }
  };

  return (
    <Card className={cn(getCardClassName())}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant={getBadgeVariant(action.status)} className="-ml-0.5">
            {getStatusText(action.status)}
          </Badge>
          {action.status !== ActionStatus.CANCELLED && (
            <ActionDropdown action={action} isApprovalNeeded={approveNeed} />
          )}
        </div>
        <CardTitle className="cursor-pointer text-xl font-semibold tracking-tight underline-offset-4 hover:underline">
          <Link href={`/actions/${action.slug}`}>{action.title}</Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2">
          {action.categories.map((category) => (
            <Link
              key={category.slug}
              href={`/actions?categorySlug=${category.slug}`}
              className="transition-transform hover:scale-102"
            >
              <Badge className="bg-secondary text-secondary-foreground border-foreground/10 text-xs">
                <TagIcon /> {category.name}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="flex flex-col items-start justify-between gap-2 text-sm md:flex-row md:items-center">
        <div className="text-muted-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(action.fullDateFrom)}</span>
          <Clock className="ml-2 h-4 w-4" />
          <span>{action.startTime}</span>
        </div>

        <div className="text-muted-foreground flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>
            {action.participants}/{action.maxParticipants}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ActionItem;
