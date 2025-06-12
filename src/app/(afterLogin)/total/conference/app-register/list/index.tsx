'use client';

import { Box, Button, Card, Stack } from '@mui/material';
import TableBody from '@/components/core/table/TableBody';
import { TablePagination } from '@/components/core/table/TablePagination';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { DTCellBox } from '@/components/DTCellBox';
import { PATH } from '@/paths';
import useCustomSearchParams from '@/hooks/useCustomSearchParams';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { logger } from '@/lib/logger/defaultLogger';
import { Loading } from '@/components/core/Loading';
import { PageTitle } from '@/components/core/PageTitle';
import { AppExposureConferenceDT } from '@/api/types/AppExposureConferenceTypes';
import { useRouter } from 'next/navigation';
import {
  changeAppExposureStatusAPI,
  getAppConferenceList,
} from '@/api/conferenceApi';
import {
  AppExposureConferenceFilters,
  AppExposureConferenceFiltersType,
} from '@/app/(afterLogin)/total/conference/app-register/list/AppExposureConferenceFilters';
import { InitSearchParam } from '@/lib/InitSearchParams';
import { TableSearchParams } from '@/api/types/tableSearchParams';
import { CHIP_COLOR } from '@/components/core/Chip';
import Chip from '@mui/material/Chip';
const ConferenceAppRegisterList = () => {
  const queryClient = useQueryClient();

  const [totalCount, setTotalCount] = useState<number>(0);
  const router = useRouter();
  // 앱 노출 여부 디테일 페이지로 이동하기
  const moveAppExposureDetail = useCallback((conferenceIdx: number) => {
    router.push(PATH.TOTAL.CONFERENCE.APP_REGISTER.VIEW(conferenceIdx));
  }, []);

  async function changeAppExposureStatus(param: {
    conferenceIdx: number;
    desiredStatus: string;
  }) {
    try {
      const result = await changeAppExposureStatusAPI(param);
      await queryClient.invalidateQueries({
        queryKey: ['getAppConferenceList', cSearchParams],
      });
      return result;
    } catch (error) {
      console.error('Mutation error:', error);
      throw error;
    }
  }

  const columnHelper = createColumnHelper<AppExposureConferenceDT>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('conferenceIdx', {
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
      columnHelper.accessor('conferenceName', {
        header: '학회명',
        cell: (info) => {
          return (
            <DTCellBox>
              <Button
                sx={{
                  border: 0,
                  textDecoration: 'underline',
                  textUnderlinePosition: 'under',
                }}
                onClick={() => {
                  moveAppExposureDetail(
                    info.row.original.conferenceIdx as number
                  );
                }}
                title={`${info.row.original.conferenceIdx}`}
              >
                {`${info.getValue()}`}
              </Button>
            </DTCellBox>
          );
        },
      }),
      columnHelper.accessor('committeeName', {
        header: '주최/주관',
        cell: (info) => (
          <DTCellBox>
            <span>{info.getValue()}</span>
          </DTCellBox>
        ),
      }),
      columnHelper.accessor('conferenceRegistrationT', {
        header: '등록 요청일시',
        cell: (info) => (
          <DTCellBox>
            <span>{info.getValue()}</span>
          </DTCellBox>
        ),
      }),
      columnHelper.accessor('conferenceDate', {
        header: '학회 일시',
        cell: (info) => (
          <DTCellBox>
            <span>{info.getValue() ? info.getValue() : '-'}</span>
          </DTCellBox>
        ),
      }),
      columnHelper.accessor('onlineOfflineSupportStatus', {
        header: '장소',
        cell: (info) => {
          const status = info.row.original.onlineOfflineSupportStatus;

          // 상태에 따른 텍스트 및 색상 결정
          let statusText: string;
          let chipColor: CHIP_COLOR; // 기본 색상

          if (status === 'online_only') {
            statusText = '온라인';
            chipColor = CHIP_COLOR.success;
          } else if (status === 'online_offline') {
            statusText = '온라인 + 오프라인';
            chipColor = CHIP_COLOR.primary;
          } else {
            statusText = '오프라인';
            chipColor = CHIP_COLOR.error;
          }

          return (
            <DTCellBox>
              <Chip color={chipColor} label={statusText} />
            </DTCellBox>
          );
        },
      }),
      columnHelper.accessor('conferenceApplyStatus', {
        header: '등록 상태',
        cell: (info) => {
          const status = info.row.original.conferenceApplyStatus;

          // 상태에 따른 텍스트 및 색상 결정
          let statusText: string;
          let chipColor: CHIP_COLOR; // 기본 색상

          if (status === 'apply') {
            statusText = '대기';
            chipColor = CHIP_COLOR.secondary;
          } else if (status === 'active') {
            statusText = '등록';
            chipColor = CHIP_COLOR.success;
          } else {
            statusText = '미등록';
            chipColor = CHIP_COLOR.error;
          }

          return (
            <DTCellBox>
              <Chip color={chipColor} label={statusText} />
            </DTCellBox>
          );
        },
      }),
      columnHelper.display({
        header: '등록 상태',
        cell: (info) => {
          const status = info.row.original.conferenceApplyStatus;
          let buttons: any[];
          if (status === 'apply') {
            buttons = [
              <DTCellBox key="active">
                <button
                  style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                  onClick={() =>
                    changeAppExposureStatus({
                      conferenceIdx: info.row.original.conferenceIdx,
                      desiredStatus: 'active',
                    })
                  }
                >
                  등록
                </button>
              </DTCellBox>,
              <DTCellBox key="delete">
                <button
                  style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                  onClick={() =>
                    changeAppExposureStatus({
                      conferenceIdx: info.row.original.conferenceIdx,
                      desiredStatus: 'delete',
                    })
                  }
                >
                  미등록
                </button>
              </DTCellBox>,
            ];
          } else if (status === 'active') {
            buttons = [
              <DTCellBox key="delete">
                <button
                  style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                  onClick={() =>
                    changeAppExposureStatus({
                      conferenceIdx: info.row.original.conferenceIdx,
                      desiredStatus: 'delete',
                    })
                  }
                >
                  미등록
                </button>
              </DTCellBox>,
            ];
          } else {
            buttons = [
              <DTCellBox key="delete">
                <button
                  style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                  onClick={() =>
                    changeAppExposureStatus({
                      conferenceIdx: info.row.original.conferenceIdx,
                      desiredStatus: 'active',
                    })
                  }
                >
                  등록
                </button>
              </DTCellBox>,
            ];
          }

          return (
            <DTCellBox>
              <span>{buttons}</span>
            </DTCellBox>
          );
        },
      }),
    ],
    [columnHelper, moveAppExposureDetail]
  );

  const initSearchParam = InitSearchParam(
    null,
    'tbl_conference.conference_idx',
    'desc',
    20
  );
  const { cSearchParams, setCSearchParamsFunc, deleteCSearchParams } =
    useCustomSearchParams<TableSearchParams>(initSearchParam);

  const { data, isPending } = useQuery({
    queryKey: ['getAppConferenceList', cSearchParams],
    queryFn: () =>
      getAppConferenceList(cSearchParams)
        .then((result) => {
          setTotalCount(result.totalCount as number);
          return result.content;
        })
        .catch((error) => {
          logger.error('<getAppConferenceList error>', error);
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
            <PageTitle title="강좌 등록 요청 목록" />
          </Box>
        </Stack>
        <Card>
          <AppExposureConferenceFilters
            cSearchParams={cSearchParams}
            setSearchParams={setCSearchParamsFunc}
            deleteSearchParams={deleteCSearchParams}
          />
          <TableBody<AppExposureConferenceDT>
            data={data as AppExposureConferenceDT[]}
            columns={columns as ColumnDef<AppExposureConferenceDT>[]}
            selectable={false}
            hideHead={false}
            uniqueRowId={(row: AppExposureConferenceDT) =>
              row.conferenceIdx as number
            }
            isHover={true}
            noDataMessage={'강좌 등록 내역이 없습니다.'}
          />
          <TablePagination<AppExposureConferenceFiltersType>
            cSearchParams={cSearchParams as AppExposureConferenceFiltersType}
            setCSearchParamsFunc={setCSearchParamsFunc}
            totalCount={totalCount}
          />
        </Card>
      </Stack>
    </Box>
  );
};

export { ConferenceAppRegisterList };
