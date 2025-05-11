'use no memo'

import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type {
  ColumnDef,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/custom/datatable-pagination'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface DataTableProps<TData, TValue> {
  columns: Array<ColumnDef<TData, TValue>>
  data: Array<TData>
  displayRowSelection?: boolean
  hasTotalsFooter?: boolean
  footerColspan?: number
  footerTotalValue?: string
  hasInvisibleColumns?: boolean
  columnsWithVisibilityStatus?: Record<string, boolean>
  defaultPageSize?: number
  displayColumnVisibilityDropdown?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  displayRowSelection,
  footerColspan,
  footerTotalValue,
  hasTotalsFooter,
  hasInvisibleColumns,
  displayColumnVisibilityDropdown,
  columnsWithVisibilityStatus,
  defaultPageSize,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    columnsWithVisibilityStatus || {},
  )
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState({
    pageIndex: 0, // initial page index
    pageSize: defaultPageSize || 10, // default page size
  })
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,

    state: {
      sorting,
      rowSelection,
      columnVisibility,
      pagination,
    },
    initialState: {
      columnVisibility: hasInvisibleColumns ? columnsWithVisibilityStatus : {},
    },
  })

  return (
    <div className="space-y-4">
      {displayColumnVisibilityDropdown && (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Toggle visible columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader className="bg-secondary">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {hasTotalsFooter && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={footerColspan}>Total</TableCell>
                <TableCell className="text-right">{footerTotalValue}</TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
      <DataTablePagination
        table={table}
        displayRowSelection={displayRowSelection}
      />
    </div>
  )
}
