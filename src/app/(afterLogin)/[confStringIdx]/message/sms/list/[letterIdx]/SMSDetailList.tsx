import { useMemo } from 'react';
import { Box, Chip } from '@mui/material';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { SMSDetailListDT, taskStatusLabels } from '@/api/types/messageTypes';
import TableBody from '@/components/core/table/TableBody';
import { DTCellBox } from '@/components/DTCellBox';
import { TablePagination } from '@/components/core/table/TablePagination';
import { TableSearchParams } from '@/api/types/tableSearchParams';

interface SMSDetailListProps<T> {
  data: SMSDetailListDT[];
  totalCount: number;
  cSearchParams: T;
  setCSearchParamsFunc: (parma: any) => any;
}

const SMSDetailList = <T extends object>({
  data,
  totalCount,
  cSearchParams,
  setCSearchParamsFunc,
}: SMSDetailListProps<T>) => {
  const columnHelper = createColumnHelper<SMSDetailListDT>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: '이름',
        cell: (info) => {
          return (
            <DTCellBox>
              <span>{info.getValue()}</span>
            </DTCellBox>
          );
        },
      }),
      columnHelper.accessor('phone', {
        header: '전화번호',
        cell: (info) => {
          return (
            <DTCellBox>
              <span>{info.getValue()}</span>
            </DTCellBox>
          );
        },
      }),
      columnHelper.accessor('taskStatus', {
        header: '발송상태',
        cell: (info) => {
          return (
            <DTCellBox>
              <Chip
                variant="outlined"
                label={taskStatusLabels[info.row.original.taskStatus]}
              />
            </DTCellBox>
          );
        },
      }),
      columnHelper.accessor('failReason', {
        header: '실패사유',
        cell: (info) => {
          return (
            <DTCellBox>
              <span>{info.getValue() ? info.getValue() : '-'}</span>
            </DTCellBox>
          );
        },
      }),
    ],
    [columnHelper]
  );
  return (
    <Box sx={{ mt: 2 }}>
      <TableBody<SMSDetailListDT>
        // data={data.content}
        data={data}
        columns={columns as ColumnDef<SMSDetailListDT>[]}
        selectable
        hideHead={false}
        uniqueRowId={(row: SMSDetailListDT) => row.letterItemIdx as number}
        isHover={true}
        // size="medium"
      />
      <TablePagination<TableSearchParams>
        cSearchParams={cSearchParams as TableSearchParams}
        setCSearchParamsFunc={setCSearchParamsFunc}
        // totalCount={data.totalCount as unknown as number}
        totalCount={totalCount}
      />
    </Box>
  );
};

export { SMSDetailList };
