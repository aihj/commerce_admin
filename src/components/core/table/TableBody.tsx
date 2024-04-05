import React, { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  TableContainer,
  Table,
  Paper,
  Box,
  TableHead,
  TableBody as MuiTableBody,
  TableRow,
  Typography,
  TableCell,
} from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';
import Checkbox from '@mui/material/Checkbox';

type RowId = number | string;
interface ReactTableProps<TRowModel extends object> {
  data: TRowModel[];
  columns: ColumnDef<any>[];
  selectable?: boolean; // true일 경우 전체 선택할 수 있는 창이 생성됨
  hideHead?: boolean; // true일 경우 head 부분 노출 안 함
  selected?: Set<RowId>; // 선택한 row의 고유번호
  onSelectAll?: (event: React.ChangeEvent) => void;
  onDeselectAll?: (event: React.ChangeEvent) => void; // ?????????????
  uniqueRowId?: (row: TRowModel) => RowId;
  isHover?: boolean;
}

export const TableBody = <TRowModel extends object>({
  data,
  columns,
  selectable,
  hideHead,
  selected,
  onDeselectAll,
  onSelectAll,
  uniqueRowId,
  isHover,
  ...props
}: ReactTableProps<TRowModel>) => {
  const [sorting, setSorting] = useState();
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),

    // 정렬 기능
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    // 페이지네이션 관련
    manualPagination: true,
  });
  // ******************************************
  const rows = table.getRowModel().rows;
  const selectedSome =
    (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;
  return (
    <>
      <TableContainer component={Paper}>
        <Table {...props}>
          <TableHead
            sx={{
              wordBreak: 'keep-all',
              ...(hideHead && {
                visibility: 'collapse',
                '--TableCell-borderWidth': 0,
              }),
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {/* selectable true일 경우 나타나는 체크리스트들? */}
                {selectable ? (
                  <TableCell
                    padding="checkbox"
                    sx={{ width: '40px', minWidth: '20px', maxWidth: '40px' }}
                  >
                    <Checkbox
                      checked={selectedAll}
                      indeterminate={selectedSome}
                      onChange={(event: React.ChangeEvent) => {
                        if (selectedAll) {
                          onDeselectAll?.(event);
                        } else {
                          onSelectAll?.(event);
                        }
                      }}
                    />
                  </TableCell>
                ) : null}

                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sx={{
                      width: header.getSize(),
                      minWidth: header.getSize(),
                      maxWidth: header.getSize(),
                      textAlign: 'center',
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted()] ?? null}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>

          <MuiTableBody>
            {rows.length > 0 ? (
              rows.map((row: any) => {
                const rowId = row.id ? row.id : uniqueRowId?.(row);
                const rowSelected = rowId ? selected?.has(rowId) : false;

                return (
                  <TableRow hover={isHover} key={row.id} selected={rowSelected}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} align="right">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllLeafColumns().length}>
                  <Box width={'100%'} py={3}>
                    <Typography variant="h6" textAlign={'center'}>
                      No records found
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </MuiTableBody>
        </Table>
      </TableContainer>
    </>
  );
};
export default TableBody;
