'use client';

import { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  PaginationState,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import {
  BanIcon,
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import MyAvatar from '@/components/global/MyAvatar';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CustomDialog from '@/components/global/CustomDialog';
import Link from 'next/link';
import { cn, formatDate } from '@/lib/utils';
import BanUserForm from './BanUserForm';
import YesNoAlertDialog from '@/components/global/YesNoAlertDialog';
import { unBanUser } from '@/actions/admin/unbanUser.action';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export type UserTableRow = {
  role: 'volunteer' | 'organization';
  id: string;
  name: string;
  username: string;
  email: string;
  image?: string | null;
  isBanned: boolean | null;
  banExpires: Date | null;
  banReason: string | null;
};

type Props = {
  users: UserTableRow[];
  firstColumnHeader?: string;
};

const VolunteersTable = ({ users, firstColumnHeader }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUnbanModalOpen, setIsUnbanModalOpen] = useState(false);

  const [userToBan, setUserToBan] = useState<UserTableRow | null>(null);
  const [userToUnban, setUserToUnban] = useState<UserTableRow | null>(null);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns: ColumnDef<UserTableRow>[] = [
    {
      header: firstColumnHeader || 'Volonter',
      accessorKey: 'name',
      size: 200,
      cell: ({ row }) => (
        <Link
          href={`/${row.original.role}s/${row.original.username}`}
          className="group flex min-w-0 items-center gap-3"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 truncate">
                <MyAvatar imageUrl={row.original.image} fallbackText={row.original.name} />
                <span className="group-hover:text-primary truncate font-medium transition-colors">
                  {row.original.name}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>{row.original.name}</TooltipContent>
          </Tooltip>
        </Link>
      ),
    },
    {
      header: 'Mejl',
      accessorKey: 'email',
      size: 180,
      cell: ({ row }) => (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-muted-foreground min-w-0 truncate text-left text-sm">
              {row.original.email}
            </div>
          </TooltipTrigger>
          <TooltipContent>{row.original.email}</TooltipContent>
        </Tooltip>
      ),
    },
    {
      header: 'Ban ističe',
      accessorKey: 'banExpires',
      size: 160,
      cell: ({ row }) => (
        <div className="text-muted-foreground min-w-0 truncate text-left text-sm">
          {row.original.banExpires ? formatDate(row.original.banExpires) : '-'}
        </div>
      ),
    },
    {
      header: 'Razlog',
      accessorKey: 'banReason',
      size: 200,
      cell: ({ row }) => (
        <>
          {row.original.banReason ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-muted-foreground min-w-0 truncate text-left text-sm">
                  {row.original.banReason ? row.original.banReason : '-'}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {row.original.banReason ? row.original.banReason : '-'}
              </TooltipContent>
            </Tooltip>
          ) : (
            <span className="text-muted-foreground min-w-0 truncate text-left text-sm">-</span>
          )}
        </>
      ),
    },
    {
      id: 'actions',
      header: '',
      size: 100,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex justify-center">
          {row.original.isBanned ? (
            <Button
              size="sm"
              onClick={() => {
                setUserToUnban(row.original);
                setIsUnbanModalOpen(true);
              }}
            >
              Skloni ban
            </Button>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setUserToBan(row.original);
                setIsModalOpen(true);
              }}
            >
              <BanIcon />
              Banuj
            </Button>
          )}
        </div>
      ),
    },
  ];

  const [sorting, setSorting] = useState<SortingState>([]);

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

  return (
    <div className="space-y-4">
      <div className="bg-background overflow-hidden rounded-md border">
        <Table className="w-full table-fixed">
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className="align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nema podataka.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <Label>Prikaži po</Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={value => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-fit whitespace-nowrap">
              <SelectValue placeholder="Select number" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 25, 50].map(pageSize => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronFirstIcon size={16} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeftIcon size={16} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRightIcon size={16} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronLastIcon size={16} />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {/* Banovanje korisnika */}
      <CustomDialog
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        title={`Banovanje korisnika ${userToBan?.name}`}
        description="Unesite razlog i trajanje zabrane pristupa"
      >
        <BanUserForm userToBan={userToBan} onClose={() => setIsModalOpen(false)} />
      </CustomDialog>

      {/* Sklanjanje bana korisniku */}
      <YesNoAlertDialog
        isOpen={isUnbanModalOpen}
        setIsOpen={setIsUnbanModalOpen}
        title={`Sklanjanje bana korisniku ${userToUnban?.name}`}
        description="Da li ste sigurni da želite da sklonite ban ovom korisniku?"
        confirmText="Da, skloni ban"
        cancelText="Otkaži"
        onConfirm={async () => {
          if (!userToUnban) return;

          const { error } = await unBanUser(userToUnban?.id);

          if (error) {
            console.error(error);
          } else {
            setIsUnbanModalOpen(false);
            toast.success('Ban je uspešno sklonjen.');
          }
        }}
      />
    </div>
  );
};

export default VolunteersTable;
