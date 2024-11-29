import { useEffect, useMemo } from 'react';
import { Box } from '@mui/material';
import { SMSDetailListDT } from '@/api/types/messageTypes';
import { TablePagination } from '@/components/core/table/TablePagination';
import { TableSearchParams } from '@/api/types/tableSearchParams';
import { CHIP_COLOR, Chip } from '@/components/core/Chip';
import { CustomTooltip } from '@/components/CustomTooltip';
import { DataTable, ColumnDef } from '@/components/core/DataTable';
import { showPhoneWithHyphen } from '@/lib/showPhoneWithHyphen';
import { useSelection } from '@/hooks/useSelection';

interface SMSDetailListProps<T> {
  data: SMSDetailListDT[];
  totalCount: number;
  cSearchParams: T;
  setCSearchParamsFunc: (parma: any) => any;
  handleSelectedUser: (selected: number[]) => void;
}

const SMSDetailList = <T extends object>({
  data,
  totalCount,
  cSearchParams,
  setCSearchParamsFunc,
  handleSelectedUser,
}: SMSDetailListProps<T>) => {
  const smsDetailIds = useMemo(
    () => data.map((smsDetail) => smsDetail.letterItemIdx),
    [data]
  );

  const { deselectAll, deselectOne, selectAll, selectOne, selected } =
    useSelection(smsDetailIds);

  const columns = [
    {
      formatter: (row): JSX.Element => <Box>{row.receiverName}</Box>,
      name: '이름',
    },
    {
      formatter: (row): JSX.Element => (
        <Box>
          {showPhoneWithHyphen(row.receiverPhoneNumber?.toString() || '')}
        </Box>
      ),
      name: '휴대폰 번호',
    },
    {
      formatter: (row): JSX.Element => (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Chip
            color={
              row.resultCode === 'success'
                ? CHIP_COLOR.primary
                : row.resultCode === 'schedule'
                  ? CHIP_COLOR.neutral
                  : row.resultCode === 'cancel'
                    ? CHIP_COLOR.info
                    : row.resultCode === 'server_in_progress'
                      ? CHIP_COLOR.pink
                      : row.resultCode === 'schedule_cancel'
                        ? CHIP_COLOR.neutral
                        : row.resultCode === 'pending'
                          ? CHIP_COLOR.neutral
                          : CHIP_COLOR.error
            }
            label={
              row.resultCode === 'success'
                ? '성공'
                : row.resultCode === 'schedule'
                  ? '예약'
                  : row.resultCode === 'cancel'
                    ? '발송 취소'
                    : row.resultCode === 'server_in_progress'
                      ? '서버 발송중'
                      : row.resultCode === 'schedule_cancel'
                        ? '예약 취소'
                        : row.resultCode === 'pending'
                          ? '알 수 없음'
                          : '실패'
            }
          />
        </Box>
      ),
      name: '발송 상태',
    },
    {
      formatter: (row): JSX.Element => (
        <Box>
          <CustomTooltip title={row.resultCode} placement="bottom">
            <button style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {row.resultCode === ('success' || 'schedule')
                ? '-'
                : row.resultDescription}
            </button>
          </CustomTooltip>
        </Box>
      ),
      name: '실패 사유',
    },
  ] satisfies ColumnDef<SMSDetailListDT>[];

  useEffect(() => {
    const arraySelected = Array.from(selected);
    if (arraySelected.length) {
      handleSelectedUser(arraySelected);
    }
  }, [selected]);

  return (
    <Box sx={{ mt: 2, maxHeight: '1000px', overflow: 'auto' }}>
      <DataTable<SMSDetailListDT>
        rows={data}
        columns={columns}
        selectable
        uniqueRowId={(row: SMSDetailListDT) => row.letterItemIdx as number}
        selected={selected}
        onSelectAll={() => {
          selectAll();
        }}
        onDeselectAll={() => deselectAll()}
        onSelectOne={(_, row) =>
          selectOne(row.letterItemIdx as unknown as number)
        }
        onDeselectOne={(_, row) =>
          deselectOne(row.letterItemIdx as unknown as number)
        }
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
