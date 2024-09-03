'use client';

import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  TooltipProps,
  Typography,
  styled,
  tooltipClasses,
} from '@mui/material';
import {
  LetterDtResponse,
  // SEND_STATUS,
  sendStatusLabels,
} from '@/api/types/messageTypes';
import TableBody from '@/components/core/table/TableBody';
import { TablePagination } from '@/components/core/table/TablePagination';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { MemoIcon } from '@/components/icons/MemoIcon';
import { DTCellBox } from '@/components/DTCellBox';
import { FailCaseModal } from './FailCaseModal';
import { useParams, useRouter } from 'next/navigation';
import { PATH } from '@/paths';
import { SMSListFilters, SMSListFiltersType } from './SMSListFilters';
import useCustomSearchParams from '@/hooks/useCustomSearchParams';
import { TableSearchParams } from '@/api/types/tableSearchParams';
import { useSelector } from 'react-redux';
import { selectConferenceIdx } from '@/redux/slices/pcoSlice';
import { useQuery } from '@tanstack/react-query';
import { getAdministrators } from '@/api/mediAdminApi';
import { logger } from '@/lib/logger/defaultLogger';
import { getSMSList } from '@/api/messageApi';
import { Loading } from '@/components/core/Loading';

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 200,
    background: '#384250',
    marginTop: '0 !important',
  },
});

const SMSList = () => {
  const [failModalOpen, setFailModalOpen] = useState<boolean>(false);
  const [administrators, setAdministrators] = useState<
    {
      value: number;
      label: string;
    }[]
  >([]);

  const [totalCount, setTotalCount] = useState<number>(0);

  const router = useRouter();
  const { confStringIdx } = useParams();
  // 문자 발송 상세 페이지로 이동하기
  const moveSMSSendDetail = useCallback(
    (letterIdx: number) => {
      router.push(
        PATH.EACH.MESSAGE.SMS.DETAIL(
          confStringIdx as string,
          letterIdx as number
        )
      );
    },
    [confStringIdx, router]
  );

  const columnHelper = createColumnHelper<LetterDtResponse>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('letterIdx', {
        header: '고유번호',
        cell: (info) => {
          return (
            <DTCellBox>
              <span>{info.getValue()}</span>
            </DTCellBox>
          );
        },
        size: 60,
      }),
      columnHelper.accessor('receiverInfo', {
        header: '수신자',
        cell: (info) => {
          return (
            <DTCellBox>
              <Button
                sx={{
                  border: 0,
                  textDecoration: 'underline',
                  textUnderlinePosition: 'under',
                }}
                onClick={() =>
                  moveSMSSendDetail(info.row.original.letterIdx as number)
                }
                title={`${info.row.original.letterIdx}`}
              >
                {`${info.getValue()}`}
              </Button>
            </DTCellBox>
          );
        },
      }),
      columnHelper.accessor('sendDate', {
        header: '발송요청일시',
        cell: (info) => (
          <DTCellBox>
            <span>{info.getValue()}</span>
          </DTCellBox>
        ),
      }),
      columnHelper.accessor('completeDate', {
        header: '발송완료일시',
        cell: (info) => (
          <DTCellBox>
            <span>{info.getValue()}</span>
          </DTCellBox>
        ),
      }),
      columnHelper.accessor('hasMemo', {
        header: '메모',
        cell: (info) => (
          <DTCellBox>
            {info.row.original.hasMemo ? (
              <CustomTooltip title={info.row.original.memo} placement="bottom">
                <IconButton sx={{ pb: 0 }}>
                  <MemoIcon size={16} />
                </IconButton>
              </CustomTooltip>
            ) : (
              <></>
            )}
          </DTCellBox>
        ),
        size: 10,
      }),
      columnHelper.accessor('content', {
        header: '내용',
        cell: (info) => (
          <DTCellBox
            style={{
              maxWidth: '300px',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            <CustomTooltip title={info.row.original.content} placement="bottom">
              <button style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {info.row.original.content}
              </button>
            </CustomTooltip>
          </DTCellBox>
        ),
      }),
      columnHelper.accessor('messageType', {
        header: '타입',
        cell: (info) => (
          <DTCellBox>
            <Chip
              color={
                info.row.original.messageType === 'mms'
                  ? 'success'
                  : 'secondary'
              }
              label={info.row.original.messageType?.toUpperCase()}
            />
          </DTCellBox>
        ),
        size: 80,
      }),
      columnHelper.accessor('sendStatus', {
        header: '상태',
        cell: (info) => (
          <DTCellBox>
            <Chip
              variant="outlined"
              // sx={{ borderColor: 'red' }}
              // icon
              label={sendStatusLabels[info.row.original.sendStatus]}
            />
            {/* {sendStatusLabels[info.row.original.sendStatus]} */}
          </DTCellBox>
        ),
        size: 80,
      }),
      columnHelper.accessor('failureCount', {
        header: '실패',
        cell: (info) => (
          <DTCellBox>
            <span>
              <button
                className="text-error-main underline font-bold"
                onClick={() =>
                  // TODO 모달은 2차로
                  // setFailModalOpen(true)
                  moveSMSSendDetail(info.row.original.letterIdx as number)
                }
              >
                {info.row.original.failureCount}
              </button>{' '}
              / {info.row.original.count}
            </span>
          </DTCellBox>
        ),
        size: 60,
      }),
      columnHelper.accessor('senderName', {
        header: '관리자',
        cell: (info) => (
          <DTCellBox>
            <span>{info.row.original.senderName}</span>
          </DTCellBox>
        ),
        size: 60,
      }),
    ],
    [columnHelper, moveSMSSendDetail]
  );

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
  const { cSearchParams, setCSearchParamsFunc, deleteCSearchParams } =
    useCustomSearchParams<TableSearchParams>(initSearchParam);

  const { data: getAdministratorsData } = useQuery({
    queryKey: ['getAdministrators'],
    queryFn: () =>
      getAdministrators()
        .then((result) => {
          const newData = result.map((item) => ({
            label: item.name,
            value: item.wuserIdx,
          }));
          setAdministrators(newData);
          logger.debug('getAdministratorsData', getAdministratorsData);
          return result;
        })
        .catch((error) => {
          logger.error('<getAdministrators error>', error);
        }),
  });

  const { data, isPending } = useQuery({
    queryKey: ['getSMSList', cSearchParams],
    queryFn: () =>
      getSMSList(cSearchParams)
        .then((result) => {
          setTotalCount(result.totalCount as number);
          return result.content;
        })
        .catch((error) => {
          logger.error('<getSMSList error>', error);
        }),
  });

  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      {isPending && <Loading open={isPending} />}
      <Stack spacing={4}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          sx={{ alignItems: 'flex-start' }}
        >
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">문자 발송 목록</Typography>
          </Box>
        </Stack>
        <Card>
          <SMSListFilters
            cSearchParams={cSearchParams}
            setSearchParams={setCSearchParamsFunc}
            deleteSearchParams={deleteCSearchParams}
            administrators={administrators}
          />
          <TableBody<LetterDtResponse>
            data={data as LetterDtResponse[]}
            columns={columns as ColumnDef<LetterDtResponse>[]}
            selectable={false}
            hideHead={false}
            uniqueRowId={(row: LetterDtResponse) => row.letterIdx as number}
            isHover={true}
            noDataMessage={'문자 발송 내역이 없습니다.'}
          />
          <TablePagination<SMSListFiltersType>
            cSearchParams={cSearchParams as SMSListFiltersType}
            setCSearchParamsFunc={setCSearchParamsFunc}
            totalCount={totalCount}
          />
        </Card>
      </Stack>
      <FailCaseModal
        open={failModalOpen}
        handleClose={() => setFailModalOpen(false)}
      />
    </Box>
  );
};

export { SMSList };
