import prisma from '@/lib/prisma';
import { ActionStatus } from '@prisma/types';
import type { Prisma } from '@prisma/types';
import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_PAGE_SIZE = 100;
const MAX_PAGE_SIZE = 100;

type QueryStatus = 'upcoming' | 'active' | 'completed' | 'cancelled' | 'default';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const now = new Date();

    const searchTerm = getSearchTerm(searchParams);
    const { appliedStatus, where: statusFilter } = resolveStatusFilter(searchParams, now);
    const cityFilters = getList(searchParams, 'city');
    const categoryIds = getList(searchParams, 'categoryId');
    const categorySlugs = getList(searchParams, 'categorySlug');
    const organizerIds = getList(searchParams, 'organizerId');
    const organizerUsernames = getList(searchParams, 'organizerUsername');
    const dateFrom = getDate(searchParams, 'dateFrom');
    const dateTo = getDate(searchParams, 'dateTo');
    const minParticipants = getNumber(searchParams, 'minParticipants');
    const maxParticipants = getNumber(searchParams, 'maxParticipants');
    const minVolunteers = getNumber(searchParams, 'minVolunteers');
    const maxVolunteers = getNumber(searchParams, 'maxVolunteers');
    const north = getFloat(searchParams, 'north');
    const south = getFloat(searchParams, 'south');
    const east = getFloat(searchParams, 'east');
    const west = getFloat(searchParams, 'west');
    const sort = searchParams.get('sort');
    const page = Math.max(1, getNumber(searchParams, 'page') ?? 1);
    const pageSizeRaw = getNumber(searchParams, 'pageSize') ?? DEFAULT_PAGE_SIZE;
    const pageSize = Math.max(1, Math.min(pageSizeRaw, MAX_PAGE_SIZE));

    const filters: Prisma.ActionWhereInput[] = [];

    if (statusFilter) {
      filters.push(statusFilter);
    }

    if (searchTerm) {
      filters.push({
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { city: { contains: searchTerm, mode: 'insensitive' } },
          { address: { contains: searchTerm, mode: 'insensitive' } },
        ],
      });
    }

    if (cityFilters.length) {
      filters.push({ city: { in: cityFilters } });
    }

    if (categoryIds.length) {
      filters.push({ categories: { some: { id: { in: categoryIds } } } });
    }

    if (categorySlugs.length) {
      filters.push({ categories: { some: { slug: { in: categorySlugs } } } });
    }

    if (organizerIds.length) {
      filters.push({ organizerUserId: { in: organizerIds } });
    }

    if (organizerUsernames.length) {
      filters.push({ organizer: { username: { in: organizerUsernames } } });
    }

    if (dateFrom && dateTo) {
      filters.push({ fullDateFrom: { lte: dateTo }, fullDateTo: { gte: dateFrom } });
    } else if (dateFrom) {
      filters.push({ fullDateTo: { gte: dateFrom } });
    } else if (dateTo) {
      filters.push({ fullDateFrom: { lte: dateTo } });
    }

    if (typeof minParticipants === 'number') {
      filters.push({ minParticipants: { gte: minParticipants } });
    }

    if (typeof maxParticipants === 'number') {
      filters.push({ maxParticipants: { lte: maxParticipants } });
    }

    if (typeof minVolunteers === 'number') {
      filters.push({ participants: { gte: minVolunteers } });
    }

    if (typeof maxVolunteers === 'number') {
      filters.push({ participants: { lte: maxVolunteers } });
    }

    if ([north, south, east, west].every((value) => typeof value === 'number')) {
      filters.push({
        latitude: { gte: south as number, lte: north as number },
        longitude: { gte: west as number, lte: east as number },
      });
    }

    const where: Prisma.ActionWhereInput = filters.length ? { AND: filters } : {};

    const orderBy = resolveSort(sort);
    const sortKey = sort ?? 'soonest';
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const include: Prisma.ActionInclude = {
      categories: true,
      organizer: {
        select: {
          organizationName: true,
          username: true,
          image: true,
        },
      },
      _count: {
        select: { participations: true },
      },
    };

    const [actions, total] = await Promise.all([
      prisma.action.findMany({ where, include, orderBy, skip, take }),
      prisma.action.count({ where }),
    ]);

    return NextResponse.json({
      data: actions,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        sort: sortKey,
        appliedFilters: buildAppliedFilters({
          searchTerm,
          status: appliedStatus,
          cityFilters,
          categoryIds,
          categorySlugs,
          organizerIds,
          organizerUsernames,
          dateFrom,
          dateTo,
          minParticipants,
          maxParticipants,
          minVolunteers,
          maxVolunteers,
          bounds: [north, south, east, west].every((value) => typeof value === 'number')
            ? {
                north: north as number,
                south: south as number,
                east: east as number,
                west: west as number,
              }
            : undefined,
        }),
      },
    });
  } catch (error) {
    console.error('[actions][GET]', error);
    return NextResponse.json({ message: 'Failed to load actions.' }, { status: 500 });
  }
}

function getSearchTerm(params: URLSearchParams) {
  const search = params.get('search') ?? params.get('q');
  return search?.trim() ? search.trim() : undefined;
}

function resolveStatusFilter(params: URLSearchParams, now: Date) {
  const raw = params.get('status');
  if (!raw) return { appliedStatus: undefined as QueryStatus | undefined, where: undefined };

  const status = raw.trim().toLowerCase() as QueryStatus;

  switch (status) {
    case 'upcoming':
      return {
        appliedStatus: status,
        where: {
          fullDateFrom: { gt: now },
          status: { not: ActionStatus.CANCELLED },
        },
      };
    case 'active':
      return {
        appliedStatus: status,
        where: {
          fullDateFrom: { lte: now },
          fullDateTo: { gte: now },
          status: { not: ActionStatus.CANCELLED },
        },
      };
    case 'completed':
      return {
        appliedStatus: status,
        where: { status: ActionStatus.COMPLETED },
      };
    case 'cancelled':
      return {
        appliedStatus: status,
        where: { status: ActionStatus.CANCELLED },
      };
    case 'default':
      return { appliedStatus: status, where: undefined };
    default:
      return { appliedStatus: undefined, where: undefined };
  }
}

function getList(params: URLSearchParams, key: string) {
  const values = params.getAll(key);
  if (!values.length) return [] as string[];
  return Array.from(
    new Set(
      values
        .flatMap((value) => value.split(','))
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  );
}

function getDate(params: URLSearchParams, key: string) {
  const value = params.get(key);
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}

function getNumber(params: URLSearchParams, key: string) {
  const value = params.get(key);
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function getFloat(params: URLSearchParams, key: string) {
  const value = params.get(key);
  if (!value) return undefined;
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function resolveSort(sort: string | null): Prisma.ActionOrderByWithRelationInput[] {
  switch (sort) {
    case 'latest':
      return [{ fullDateFrom: 'desc' }];
    case 'newest':
      return [{ createdAt: 'desc' }];
    case 'oldest':
      return [{ createdAt: 'asc' }];
    case 'popular':
      return [{ participants: 'desc' }];
    case 'alphabetical':
      return [{ title: 'asc' }];
    case 'soonest':
    default:
      return [{ fullDateFrom: 'asc' }];
  }
}

function buildAppliedFilters(filters: {
  searchTerm?: string;
  status?: QueryStatus;
  cityFilters: string[];
  categoryIds: string[];
  categorySlugs: string[];
  organizerIds: string[];
  organizerUsernames: string[];
  dateFrom?: Date;
  dateTo?: Date;
  minParticipants?: number;
  maxParticipants?: number;
  minVolunteers?: number;
  maxVolunteers?: number;
  bounds?: { north: number; south: number; east: number; west: number };
}) {
  return {
    ...(filters.searchTerm ? { search: filters.searchTerm } : {}),
    ...(filters.status && filters.status !== 'default' ? { status: filters.status } : {}),
    ...(filters.cityFilters.length ? { cities: filters.cityFilters } : {}),
    ...(filters.categoryIds.length ? { categoryIds: filters.categoryIds } : {}),
    ...(filters.categorySlugs.length ? { categorySlugs: filters.categorySlugs } : {}),
    ...(filters.organizerIds.length ? { organizerIds: filters.organizerIds } : {}),
    ...(filters.organizerUsernames.length
      ? { organizerUsernames: filters.organizerUsernames }
      : {}),
    ...(filters.dateFrom ? { dateFrom: filters.dateFrom.toISOString() } : {}),
    ...(filters.dateTo ? { dateTo: filters.dateTo.toISOString() } : {}),
    ...(typeof filters.minParticipants === 'number'
      ? { minParticipants: filters.minParticipants }
      : {}),
    ...(typeof filters.maxParticipants === 'number'
      ? { maxParticipants: filters.maxParticipants }
      : {}),
    ...(typeof filters.minVolunteers === 'number' ? { minVolunteers: filters.minVolunteers } : {}),
    ...(typeof filters.maxVolunteers === 'number' ? { maxVolunteers: filters.maxVolunteers } : {}),
    ...(filters.bounds ? { bounds: filters.bounds } : {}),
  };
}
