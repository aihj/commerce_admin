import { useMemo } from 'react';
import { Box } from '@mui/material';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { SMSDetailListDT } from '@/api/types/messageTypes';
import TableBody from '@/components/core/table/TableBody';
import { DTCellBox } from '@/components/DTCellBox';
import { TablePagination } from '@/components/core/table/TablePagination';
import { TableSearchParams } from '@/api/types/tableSearchParams';
import { CHIP_COLOR, Chip } from '@/components/core/Chip';
import { CustomTooltip } from '@/components/CustomTooltip';

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
      columnHelper.accessor('resultCode', {
        header: '발송상태',
        cell: (info) => {
          return (
            <DTCellBox>
              <Chip
                color={
                  info.row.original.resultCode === 'success'
                    ? CHIP_COLOR.primary
                    : CHIP_COLOR.error
                }
                label={
                  info.row.original.resultCode === 'success' ? '성공' : '실패'
                }
              />
            </DTCellBox>
          );
        },
      }),
      columnHelper.accessor('resultDescription', {
        header: '실패사유',
        cell: (info) => {
          return (
            <DTCellBox>
              <CustomTooltip
                title={info.row.original.resultCode}
                placement="bottom"
              >
                <button
                  style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                  {info.row.original.resultCode === 'success'
                    ? '-'
                    : info.getValue()}
                </button>
              </CustomTooltip>
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
        data={data}
        columns={columns as ColumnDef<SMSDetailListDT>[]}
        selectable
        hideHead={false}
        uniqueRowId={(row: SMSDetailListDT) => row.letterItemIdx as number}
        isHover={true}
      />
      <TablePagination<TableSearchParams>
        cSearchParams={cSearchParams as TableSearchParams}
        setCSearchParamsFunc={setCSearchParamsFunc}
        totalCount={totalCount}
      />
    </Box>
  );
};

export { SMSDetailList };
