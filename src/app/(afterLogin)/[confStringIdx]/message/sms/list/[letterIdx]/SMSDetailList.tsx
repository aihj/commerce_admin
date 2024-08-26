import { useMemo } from 'react';
import { Box, Chip } from '@mui/material';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { SMSDetailListDT, sendStatusLabels } from '@/api/types/messageTypes';
import TableBody from '@/components/core/table/TableBody';
import { DTCellBox } from '@/components/DTCellBox';
import { TablePagination } from '@/components/core/table/TablePagination';
import useCustomSearchParams from '@/hooks/useCustomSearchParams';
import { TableSearchParams } from '@/api/types/tableSearchParams';
import { useSelector } from 'react-redux';
import { selectConferenceIdx } from '@/redux/slices/pcoSlice';

interface SMSDetailListProps {
  data: SMSDetailListDT[];
}

const SMSDetailList = ({ data }: SMSDetailListProps) => {
  const conferenceIdx = useSelector(selectConferenceIdx);
  // TODO 공통으로 빼기
  const initSearchParam = useMemo((): TableSearchParams => {
    return {
      conferenceIdx: conferenceIdx as number,
      currentPage: 0,
      rowsPerPage: 10,

      sortType: 'tbl_letter.letter_idx',
      sortDir: 'desc',
    };
  }, [conferenceIdx]);
  const { cSearchParams, setCSearchParamsFunc } =
    useCustomSearchParams<TableSearchParams>(initSearchParam);
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
      columnHelper.accessor('sendStatus', {
        header: '발송상태',
        cell: (info) => {
          return (
            <DTCellBox>
              <Chip
                variant="outlined"
                label={sendStatusLabels[info.row.original.sendStatus]}
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
    []
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
        totalCount={data.length}
      />
    </Box>
  );
};

export { SMSDetailList };
