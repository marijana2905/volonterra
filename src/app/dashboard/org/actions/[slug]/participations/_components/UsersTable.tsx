'use client';

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
  CheckIcon,
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  Loader2Icon,
  UserCheckIcon
} from 'lucide-react';
import Link from 'next/link';
import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';

import { cn, formatDateTime } from '@/lib/utils';

import { ActionStatusExtended, UserParticipation } from '@/types/action.type';

import { confirmAction } from '@/actions/action/confirmAction.action';

import UsersActions from './UsersActions';
import MyAvatar from '@/components/global/MyAvatar';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

import { toast } from 'sonner';


const createColumns = (
  actionId: string,
  actionStatusExtended: ActionStatusExtended
): ColumnDef<UserParticipation>[] => [
  {
    id: 'select',
    header: ({ table }) =>
      // Show header checkbox only if at least one row on the current page has status 'APPLIED'
      table.getRowModel().rows.some(row => row.original.status === 'APPLIED') ? (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        />
      ) : null,
    cell: ({ row }) =>
      row.original.status === 'APPLIED' ? (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
        />
      ) : null,
    size: 28,
    enableSorting: false,
  },
  {
    header: 'Ime i prezime',
    accessorKey: 'user.name',
    cell: ({ row }) => (
      <Link
        href={`/volunteers/${row.original.user.username}`}
        className="group hover:text-primary flex cursor-pointer items-center gap-2 font-medium"
      >
        <MyAvatar imageUrl={row.original.user.image} fallbackText={row.original.user.name} />
        <span className="underline-offset-4 group-hover:underline">{row.original.user.name}</span>
      </Link>
    ),
    size: 180,
  },
  {
    header: 'Email',
    accessorKey: 'user.email',
    cell: ({ row }) => <div className="font-medium">{row.original.user.email}</div>,
    size: 200,
  },
  {
    header: 'Korisničko ime',
    accessorKey: 'user.username',
    cell: ({ row }) => <div className="font-medium">@{row.original.user.username}</div>,
    size: 120,
  },
  {
    header: 'Datum prijave',
    accessorKey: 'createdAt',
    cell: ({ row }) => <div className="font-medium">{formatDateTime(row.original.createdAt)}</div>,
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
    size: 50,
  },
  {
    header: () => (
      <div className="flex items-center justify-center">
        <span className="sr-only">Akcije</span>
      </div>
    ),
    id: 'actions',
    cell: ({ row }) =>
      (actionStatusExtended !== 'APPROVAL_NEEDED' && actionStatusExtended !== 'COMPLETED') ||
      row.original.status === 'APPLIED' ? (
        <div className="flex justify-center">
          <UsersActions actionId={actionId} participation={row.original} />
        </div>
      ) : null,
    size: 60,
    enableSorting: false,
  },
];

type Props = {
  slug: string;
  actionId: string;
  users: UserParticipation[];
  actionStatusExtended: ActionStatusExtended;
};

const UsersTable = ({ slug, actionId, users, actionStatusExtended }: Props) => {
  const router = useRouter();
  const id = useId();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [sorting, setSorting] = useState<SortingState>([{ id: 'createdAt', desc: true }]);

  const columns = createColumns(actionId, actionStatusExtended);

  const table = useReactTable({
    data: users,
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

  const [isConfirmationPending, setIsConfirmationPending] = useState(false);

  const handleConfirmation = async () => {
    setIsConfirmationPending(true);

    const selectedUserIds = table
      .getSelectedRowModel()
      .rows.map(r => r.original)
      .filter(r => r.status !== 'CANCELLED')
      .map(r => r.user?.id ?? r.user.id)
      .filter(Boolean) as string[];

    if (selectedUserIds.length === 0) {
      toast.error('Molimo izaberite korisnike za potvrdu.');
      setIsConfirmationPending(false);
      return;
    }

    const { error } = await confirmAction(actionId, selectedUserIds);

    if (error) {
      toast.error(error);
      setIsConfirmationPending(false);
    } else {
      toast.success('Akcija potvrđena', {
        description: `Možete dodati fotografije sa akcije u galeriju.`,
      });

      router.replace('/dashboard/org/gallery');

      setIsConfirmationPending(false);
    }
  };

  return (
    <div className="space-y-4">
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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nema prijava.
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
              <SelectValue placeholder="Select number of results" />
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

      {/* potvrda dolazaka menja status akcije na completed i statuse svih prijavljenih, takodje preusmerava ga na stranicu galerija da doda fotografije */}
      {(actionStatusExtended === 'APPROVAL_NEEDED' || actionStatusExtended === 'COMPLETED') && (
        <div className="flex items-center justify-center">
          <Button size={'lg'} onClick={handleConfirmation} disabled={isConfirmationPending}>
            {isConfirmationPending ? <Loader2Icon className="animate-spin" /> : <CheckIcon />}
            Potvrdi dolaske
          </Button>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
