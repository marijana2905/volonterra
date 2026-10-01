import { Action, ActionStatus, ActionCategory, ParticipationStatus, Prisma } from '@prisma/types';

export const ActionDashboardSelect = {
  id: true,
  title: true,
  slug: true,
  minParticipants: true,
  maxParticipants: true,
  participants: true,
  startTime: true,
  endTime: true,
  fullDateFrom: true,
  fullDateTo: true,
  status: true,
  categories: {
    select: {
      slug: true,
      name: true,
    },
  },
} as const;

export type ActionDashboard = Prisma.ActionGetPayload<{
  select: typeof ActionDashboardSelect;
}>;

export const ActionCalendarSelect = {
  id: true,
  title: true,
  slug: true,
  startTime: true,
  endTime: true,
  fullDateFrom: true,
  fullDateTo: true,
  minParticipants: true,
  maxParticipants: true,
  participants: true,
  status: true,
  city: true,
  address: true,
} as const;

export type ActionCalendar = Prisma.ActionGetPayload<{
  select: typeof ActionCalendarSelect;
}>;

export type ActionStatusExtended =
  | 'ALL'
  | 'UPCOMING'
  | 'ONGOING'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'APPROVAL_NEEDED';

export type UserParticipation = {
  status: ParticipationStatus;
  createdAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    username: string | null;
    image: string | null;
  };
};

export type ActionWithOrganizerAndCategories = Action & {
  categories: ActionCategory[];
  organizer: {
    organizationName: string;
    image: string | null;
    username: string;
  };
};

// For /actions page
export const ActionListItemInclude = {
  categories: true,
  organizer: {
    select: {
      organizationName: true,
      image: true,
      username: true,
    },
  },
  _count: {
    select: { participations: true },
  },
} as const;

export type ActionListItem = Prisma.ActionGetPayload<{
  include: typeof ActionListItemInclude;
}>;

export type ActionBoundsFilter = {
  north: number;
  south: number;
  east: number;
  west: number;
};

export type ActionsApiAppliedFilters = {
  search?: string;
  statuses?: ActionStatus[];
  cities?: string[];
  categoryIds?: string[];
  categorySlugs?: string[];
  organizerIds?: string[];
  organizerUsernames?: string[];
  dateFrom?: string;
  dateTo?: string;
  minParticipants?: number;
  maxParticipants?: number;
  minVolunteers?: number;
  maxVolunteers?: number;
  bounds?: ActionBoundsFilter;
};

export type ActionsApiResponse = {
  data: ActionListItem[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    sort: string;
    appliedFilters: ActionsApiAppliedFilters;
  };
};

export type ActionImpressionType = {
  user: {
    name: string;
    id: string;
    username: string | null;
    image: string | null;
  };
} & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  actionId: string;
  rating: number;
  comment: string;
};
