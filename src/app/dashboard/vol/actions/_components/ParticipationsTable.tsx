'use client';

import { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ClipboardListIcon,
  Loader2Icon,
  MapPinIcon,
  TagIcon,
  UserCheckIcon,
} from 'lucide-react';

import { cn, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { VolunteerParticipation } from '@/types/participations.type';
import ParticipationActions from './ParticipationActions';
import DownloadVolunteerReportButton from './DownloadVolunteerReportButton';

const createColumns = (): ColumnDef<VolunteerParticipation>[] => [
  {
    header: () => (
      <div className="flex items-center gap-2">
        <ClipboardListIcon size={16} />
        <span>Naziv akcije</span>
      </div>
    ),
    accessorKey: 'action.title',
    cell: ({ row }) => (
      <Link
        href={`/actions/${row.original.action.slug}`}
        className="text-primary font-medium underline-offset-4 hover:underline"
      >
        {row.original.action.title}
      </Link>
    ),
    size: 200,
  },
  {
    header: () => (
      <div className="flex items-center gap-2">
        <MapPinIcon size={16} />
        <span>Lokacija</span>
      </div>
    ),
    accessorKey: 'action.city',
    cell: ({ row }) => (
      <div>
        <span className="text-sm leading-none">
          {row.original.action.city}, {row.original.action.address}
        </span>
      </div>
    ),
    size: 150,
  },
  {
    header: () => (
      <div className="flex items-center gap-2">
        <CalendarIcon size={16} />
        <span>Datum</span>
      </div>
    ),
    accessorKey: 'action.fullDateFrom',
    cell: ({ row }) => {
      const dateFrom = new Date(row.original.action.fullDateFrom);
      const dateTo = new Date(row.original.action.fullDateTo);

      return (
        <div className="text-sm">
          {formatDate(dateFrom)}
          {dateFrom.toDateString() !== dateTo.toDateString() && <> - {formatDate(dateTo)}</>}
        </div>
      );
    },
    size: 200,
  },
  {
    header: () => (
      <div className="flex items-center gap-2">
        <UserCheckIcon size={16} />
        <span>Status</span>
      </div>
    ),
    accessorKey: 'status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant={
            status === 'APPLIED'
              ? 'outline'
              : status === 'ATTENDED'
                ? 'default'
                : status === 'CANCELLED'
                  ? 'destructive'
                  : 'outline'
          }
        >
          {status === 'APPLIED' && 'Prijavljen'}
          {status === 'ATTENDED' && 'Prisustvovao'}
          {status === 'CANCELLED' && 'Otkazan'}
        </Badge>
      );
    },
    size: 120,
  },
  {
    header: () => (
      <div className="flex items-center gap-2">
        <TagIcon size={16} />
        <span>Tip</span>
      </div>
    ),
    accessorKey: 'type',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return (
        <Badge variant="outline">
          {type === 'INDIVIDUAL' && 'Individualno'}
          {type === 'TEAM' && 'Tim'}
        </Badge>
      );
    },
    size: 100,
  },
  {
    header: () => (
      <div className="flex items-center justify-center">
        <span className="sr-only">Akcije</span>
      </div>
    ),
    id: 'actions',
    cell: ({ row }) =>
      // Samo kad je status 'APPLIED' i tip 'INDIVIDUAL' ili ako je status 'APPLIED' i tip 'TEAM' i korisnik je kreator tima
      row.original.status === 'APPLIED' &&
      (row.original.type === 'INDIVIDUAL' ||
        (row.original.type === 'TEAM' && row.original.isUserTeamCreator)) && (
        <div className="flex justify-center">
          <ParticipationActions participation={row.original} />
        </div>
      ),
    size: 60,
    enableSorting: false,
  },
];

type Props = {
  participations: VolunteerParticipation[];
};

const ParticipationsTable = ({ participations }: Props) => {
  const id = useId();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = createColumns();

  const table = useReactTable({
    data: participations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
  });

  return (
    <div className="flex flex-col gap-4 md:px-8">
      <div className="ml-auto">
        <DownloadVolunteerReportButton />
      </div>

      <div className="bg-background overflow-hidden rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="h-11"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              'flex h-full cursor-pointer items-center justify-between gap-2 select-none'
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={e => {
                            // Enhanced keyboard handling for sorting
                            if (
                              header.column.getCanSort() &&
                              (e.key === 'Enter' || e.key === ' ')
                            ) {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: (
                              <ChevronUpIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center">
                  <div className="text-muted-foreground">Nema rezultata</div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-8">
        {/* Results per page */}
        <div className="flex items-center gap-3">
          <Label htmlFor={id} className="max-sm:sr-only">
            Prikaži po
          </Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={value => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger id={id} className="w-fit whitespace-nowrap">
              <SelectValue placeholder="Izaberite broj rezultata" />
            </SelectTrigger>
            <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
              {[5, 10, 25, 50].map(pageSize => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Page number information */}
        <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
          <p className="text-muted-foreground text-sm whitespace-nowrap" aria-live="polite">
            <span className="text-foreground">
              {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
              {Math.min(
                Math.max(
                  table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
                    table.getState().pagination.pageSize,
                  0
                ),
                table.getRowCount()
              )}
            </span>{' '}
            od <span className="text-foreground">{table.getRowCount().toString()}</span>
          </p>
        </div>
        {/* Pagination buttons */}
        <div>
          <Pagination>
            <PaginationContent>
              {/* First page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to first page"
                >
                  <ChevronFirstIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Previous page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Next page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Last page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to last page"
                >
                  <ChevronLastIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default ParticipationsTable;
