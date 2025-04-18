'use client';

import React, { useCallback, useMemo } from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { PATH } from '@/paths';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/api/attendeeApi';
import { selectConferenceIdx } from '@/redux/slices/pcoSlice';
import { useSelector } from 'react-redux';
import TableBody from '@/components/core/table/TableBody';
import {
  getUsersResponse,
  USER_STATUS,
  genderLabels,
  userStatusLabels,
} from '@/api/types/attendeeTypes';
import { TablePagination } from '@/components/core/table/TablePagination';
import { JoinAttendeeListFilters } from '@/app/(afterLogin)/[confStringIdx]/user/attendee/join/list/JoinAttendeeListFilters';
import useCustomSearchParams from '@/hooks/useCustomSearchParams';
import { TableSearchParams } from '@/api/types/tableSearchParams';
import { MemoIcon } from '@/components/icons/MemoIcon';
import { numberWithComma } from '@/lib/numberWithComma';
import { DownloadIcon } from '@/components/icons/DownloadIcon';
import { Chip } from '@/components/core/Chip';
import { setUserStatusChipColor } from '@/lib/chipColors';
import { InitSearchParam } from '@/lib/InitSearchParams';
import { PageTitle } from '@/components/core/PageTitle';

export interface JoinAttendeeListSearchParamsType extends TableSearchParams {
  birthDateStartT?: string;
  birthDateEndT?: string;
  gender?: string;
  registrationStatus?: 'not_registered' | 'pre' | 'onsite'; // 등록 상태
  wuserStatus?: USER_STATUS; // 회원 상태
}

const JoinAttendeeList = () => {
  const { confStringIdx } = useParams();
  const conferenceIdx: number = useSelector(selectConferenceIdx) as number;
  const router = useRouter();

  const initSearchParam = InitSearchParam(
    conferenceIdx as number,
    'tbl_conference_attendee.attendee_idx'
  );

  const { cSearchParams, setCSearchParamsFunc, deleteCSearchParams } =
    useCustomSearchParams<JoinAttendeeListSearchParamsType>(initSearchParam);
  // window.cSearchParams = cSearchParams;
  // endregion ***************** params 동기화 *****************

  // 유저 상세 페이지로 이동하기
  const moveUserDetail = useCallback(
    (attendeeIdx: number) => {
      router.push(
        PATH.EACH.USER.ATTENDEE.DETAIL(
          confStringIdx as string,
          attendeeIdx as number
        )
      );
    },
    [confStringIdx, router]
  );

  const columnHelper = createColumnHelper<getUsersResponse>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('attendeeIdx', {
        header: '고유번호',
        cell: (info) => (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              sx={{
                border: 0,
                textDecoration: 'underline',
                textUnderlinePosition: 'under',
              }}
              color="secondary"
              onClick={() =>
                moveUserDetail(info.row.original.attendeeIdx as number)
              }
              title={`${info.row.original.attendeeIdx}`}
            >
              {`${info.getValue()}`}
            </Button>
          </Box>
        ),
        maxSize: 2,
      }),
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
                moveUserDetail(info.row.original.attendeeIdx as number)
              }
              title={`${info.row.original.attendeeIdx}`}
            >
              <span className="mr-4">{`${info.getValue()}`}</span>
              {info.row.original.memo ? <MemoIcon size={16} /> : ''}
            </Button>
          </Box>
        ),
        minSize: 10,
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
        size: 20,
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
        header: '회원상태',
        cell: (info) => (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Chip
              key={userStatusLabels[info.row.original.wuserRoleStatus]}
              label={userStatusLabels[info.row.original.wuserRoleStatus]}
              type="soft"
              color={setUserStatusChipColor(info.row.original.wuserRoleStatus)}
            />
          </Box>
        ),
        size: 80,
      }),
      columnHelper.accessor('attendeeCreateT', {
        header: '가입날짜',
        cell: (info) => {
          return (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {info.getValue()}
            </Box>
          );
        },
        size: 110,
      }),
    ],
    [columnHelper, moveUserDetail]
  );
  // endregion ****************************** 열 구성 설정 ******************************
  const { isLoading, error, data } = useQuery({
    queryKey: ['getJoinAttendeeDt', cSearchParams],
    queryFn: () => getUsers(cSearchParams as JoinAttendeeListSearchParamsType),
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
            <PageTitle title="가입 회원 목록" />
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
          <TableBody<getUsersResponse>
            data={data.content}
            columns={columns as ColumnDef<getUsersResponse>[]}
            selectable={false}
            hideHead={false}
            uniqueRowId={(row: getUsersResponse) => row.attendeeIdx as number}
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
