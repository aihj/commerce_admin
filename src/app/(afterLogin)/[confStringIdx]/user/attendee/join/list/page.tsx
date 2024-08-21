'use client';

import React, { useCallback, useMemo } from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { PATH } from '@/paths';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getJoinAttendeeDt } from '@/api/attendeeApi';
import { selectConferenceIdx } from '@/redux/slices/pcoSlice';
import { useSelector } from 'react-redux';
import TableBody from '@/components/core/table/TableBody';
import {
  JoinAttendeeDtVo,
  genderLabels,
  registrationStatusLabels,
} from '@/api/types/attendeeTypes';
import { TablePagination } from '@/components/core/table/TablePagination';
import { JoinAttendeeListFilters } from '@/app/(afterLogin)/[confStringIdx]/user/attendee/join/list/JoinAttendeeListFilters';
import useCustomSearchParams from '@/hooks/useCustomSearchParams';
import { TableSearchParams } from '@/api/types/tableSearchParams';
import { MemoIcon } from '@/components/icons/MemoIcon';
import { registrationStatusColor } from '../../libs';
import { numberWithComma } from '@/lib/numberWithComma';
import { DownloadIcon } from '@/components/icons/DownloadIcon';

export interface JoinAttendeeListSearchParamsType extends TableSearchParams {
  birthDateStartT?: string;
  birthDateEndT?: string;
  gender?: string;
  registrationStatus?: 'not_registered' | 'pre' | 'onsite'; // 등록 상태
  wuserStatus?: 'prospective' | 'active' | 'delete'; // 회원 상태
}

const JoinAttendeeList = () => {
  const { confStringIdx } = useParams();
  const conferenceIdx: number = useSelector(selectConferenceIdx) as number;
  const router = useRouter();

  // region ***************** params 동기화 *****************
  const initSearchParam = useMemo((): JoinAttendeeListSearchParamsType => {
    return {
      conferenceIdx,
      currentPage: 0,
      rowsPerPage: 10,

      sortType: 'tbl_conference_attendee.attendee_idx',
      sortDir: 'desc',
    };
  }, [conferenceIdx]);
  const { cSearchParams, setCSearchParamsFunc, deleteCSearchParams } =
    useCustomSearchParams<JoinAttendeeListSearchParamsType>(initSearchParam);
  // window.cSearchParams = cSearchParams;
  // endregion ***************** params 동기화 *****************

  // 유저 상세 페이지로 이동하기
  const moveUserDetail = useCallback(
    (wuserIdx: number) => {
      router.push(
        PATH.EACH.USER.ATTENDEE.DETAIL(
          confStringIdx as string,
          wuserIdx as number
        )
      );
    },
    [confStringIdx, router]
  );

  const columnHelper = createColumnHelper<JoinAttendeeDtVo>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: '이름',
        cell: (info) => (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              sx={{
                border: 0,
                textDecoration: 'underline',
                textUnderlinePosition: 'under',
              }}
              onClick={() =>
                moveUserDetail(info.row.original.wuserIdx as number)
              }
              title={`${info.row.original.wuserIdx}`}
            >
              {`${info.getValue()}`}
            </Button>
          </Box>
        ),
      }),
      columnHelper.accessor('memo', {
        header: '',
        cell: (info) => (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {info.row.original.memo ? <MemoIcon size={16} /> : ''}
          </Box>
        ),
        size: 10,
      }),
      columnHelper.accessor('birthDate', {
        header: '생년',
        cell: (info) => (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', fontWeight: 500 }}
          >
            {info.getValue()}
          </Box>
        ),
        size: 10,
      }),
      columnHelper.display({
        header: '성별',
        cell: (info) => (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', fontWeight: 500 }}
          >
            {genderLabels[info.row.original.gender]}
          </Box>
        ),
        size: 60,
      }),

      columnHelper.accessor('phone', {
        header: '휴대폰 번호',
        cell: (info) => {
          return (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                fontWeight: 500,
              }}
            >
              {info.getValue()}
            </Box>
          );
        },
        size: 110,
      }),
      columnHelper.accessor('email', {
        header: '이메일',
        cell: (info) => {
          return (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                fontWeight: 500,
              }}
            >
              {info.getValue()}
            </Box>
          );
        },
        size: 110,
      }),
      columnHelper.display({
        header: '회원 상태',
        cell: (info) => {
          if (info.row.original.wuserStatus === 'active') {
            return (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  fontWeight: 500,
                }}
              >
                회원
              </Box>
            );
          } else if (info.row.original.wuserStatus === 'prospective') {
            return (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <span className="text-primary-darkest">기회원</span>
              </Box>
            );
          } else {
            return (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <span className="text-error-dark">탈퇴</span>
              </Box>
            );
          }
        },
        size: 110,
      }),
      columnHelper.accessor('wuserCreateT', {
        header: '가입 날짜',
        cell: (info) => {
          return (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {info.getValue()}
            </Box>
          );
        },
        size: 110,
      }),
      columnHelper.display({
        header: '등록 상태',
        cell: (info) => (
          <Box
            sx={{ display: 'flex', justifyContent: 'center' }}
            className={registrationStatusColor(
              info.row.original.registrationStatus
            )}
          >
            {registrationStatusLabels[info.row.original.registrationStatus]}
          </Box>
        ),
        size: 110,
      }),
    ],
    [columnHelper, moveUserDetail]
  );
  // endregion ****************************** 열 구성 설정 ******************************
  const { isLoading, error, data } = useQuery({
    queryKey: ['getJoinAttendeeDt', cSearchParams],
    queryFn: () =>
      getJoinAttendeeDt(cSearchParams as JoinAttendeeListSearchParamsType),
    enabled: !!conferenceIdx,
  });
  // **********************************************************
  if (isLoading) return <div>Loading...</div>;
  if (
    !data ||
    error ||
    !data.content ||
    data.totalCount === undefined ||
    data.totalCount === null
  )
    return <div>Error fetching data</div>;
  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      <Stack spacing={4}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          sx={{ alignItems: 'flex-start' }}
        >
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">가입 회원 목록</Typography>
          </Box>
        </Stack>

        <Card>
          <JoinAttendeeListFilters
            cSearchParams={cSearchParams as JoinAttendeeListSearchParamsType}
            setCSearchParamsFunc={setCSearchParamsFunc}
            deleteCSearchParams={deleteCSearchParams}
          />
          <Stack
            direction="row"
            sx={{
              justifyContent: 'space-between',
              alignItems: 'end',
              px: 2,
              pb: 2,
            }}
          >
            <span className="text-14 font-bold">
              전체 {numberWithComma(data.totalCount)}
            </span>
            <Button
              sx={{
                py: 0,
                px: 2,
                borderRadius: '20px',
                border: '1px solid #6366F180',
              }}
              variant="outlined"
              startIcon={<DownloadIcon size={20} fill="#6366F1" />}
            >
              엑셀 다운로드
            </Button>
          </Stack>
          <TableBody<JoinAttendeeDtVo>
            data={data.content}
            columns={columns as ColumnDef<JoinAttendeeDtVo>[]}
            selectable={false}
            hideHead={false}
            uniqueRowId={(row: JoinAttendeeDtVo) => row.attendeeIdx as number}
            isHover={true}
            // size="medium"
          />
          <TablePagination<JoinAttendeeListSearchParamsType>
            cSearchParams={cSearchParams as JoinAttendeeListSearchParamsType}
            setCSearchParamsFunc={setCSearchParamsFunc}
            totalCount={data.totalCount as unknown as number}
          />
        </Card>
      </Stack>
    </Box>
  );
};

export default JoinAttendeeList;
