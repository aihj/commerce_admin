'use client';

import React, { useCallback, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { mergeSearchParams } from '@/lib/table';
import { PATH } from '@/paths';
import { logger } from '@/lib/logger/defaultLogger';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getJoinAttendeeDt } from '@/api/attendeeApi';
import { selectConferenceIdx } from '@/redux/slices/pcoSlice';
import { useSelector } from 'react-redux';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import TableBody from '@/components/core/table/TableBody';
import { TablePagination } from '@/components/core/table/TablePagination';
import { JoinAttendeeDtVo } from '@/api/types/attendeeTypes';

interface Filter {
  searchParams: JoinAttendeeListSearchParamsType;
}

export interface JoinAttendeeListSearchParamsType {
  currentPage?: number;
  rowsPerPage?: number;

  sortType?: string; // 어떤 타입을 가지고 정렬 할 것인지
  sortDir?: 'asc' | 'desc'; // 어떤 방향으로 정렬할 것인지
  searchText: undefined;

  birthDateStartT?: string | undefined;
  birthDateEndT?: string;
  gender?: string;
  wuserStatus?: string; // 회원 상태
  registrationStatus?: 'not_registered' | 'pre' | 'onsite'; // 등록 상태
}

const JoinAttendeeList = ({ searchParams }: Filter) => {
  const { confStringIdx } = useParams();
  const conferenceIdx = useSelector(selectConferenceIdx);
  const router = useRouter();

  // 유저 상세 페이지로 이동하기
  const moveUserDetail = useCallback(
    (attendeeIdx) => {
      router.push(PATH.EACH.USER.ATTENDEE.DETAIL(confStringIdx, attendeeIdx));
    },
    [confStringIdx, router]
  );

  const columnHelper = createColumnHelper();
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: '이름',
        cell: (info) => (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              size="small"
              variant="outlined"
              color="success"
              onClick={() => moveUserDetail(info.row.original.attendeeIdx)}
              title={`${info.row.original.name}`}
            >
              {`${info.getValue()}`}
              {info.row.original.memo && <AssignmentOutlinedIcon />}
            </Button>
          </Box>
        ),
      }),
      columnHelper.accessor('birthDate', {
        header: '생년',
        cell: (info) => (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {info.getValue()}
          </Box>
        ),
        size: 10,
      }),
      columnHelper.display({
        header: '성별',
        cell: (info) => {
          if (info.row.original.gender === 'F') {
            return (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>여성</Box>
            );
          } else {
            return (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>남성</Box>
            );
          }
        },
        size: 110,
      }),

      columnHelper.accessor('phone', {
        header: '휴대폰 번호',
        cell: (info) => {
          return (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {info.getValue()}
            </Box>
          );
        },
        size: 110,
      }),
      columnHelper.display({
        header: '회원상태',
        cell: (info) => {
          if (info.row.original.wuserStatus === 'active') {
            return (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Chip label="회원" color="primary" size="small" />
              </Box>
            );
          } else if (info.row.original.wuserStatus === 'temp') {
            return (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Chip label="기회원" color="default" size="small" />
              </Box>
            );
          } else {
            return (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Chip label="탈퇴" color="error" size="small" />
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
        cell: (info) => {
          if (info.row.original.registrationStatus === 'not_registered') {
            return (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Chip label="등록 안함" color="secondary" size="small" />
              </Box>
            );
          } else if (info.row.original.registrationStatus === 'pre') {
            return (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Chip label="사전 등록" color="primary" size="small" />
              </Box>
            );
          } else {
            return (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Chip label="현장 등록" color="secondary" size="small" />
              </Box>
            );
          }
        },
        size: 110,
      }),
    ],
    [columnHelper, moveUserDetail]
  );
  // endregion ****************************** 열 구성 설정 ******************************
  const filterInitialData = {
    conferenceIdx,
    currentPage: 0,
    rowsPerPage: 10,

    sortType: 'tbl_conference_attendee.attendee_idx',
    sortDir: 'desc',
  };
  logger.debug('[searchParams', searchParams);
  const mergedSearchParams = mergeSearchParams(searchParams, filterInitialData);
  const { isLoading, error, data } = useQuery({
    queryKey: ['getJoinAttendeeDt', mergedSearchParams],
    queryFn: () => getJoinAttendeeDt(mergedSearchParams),
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
            <Typography variant="h4">등록 회원 목록</Typography>
          </Box>
          {/*          <div>
            <Button
              component={RouterLink}
              href={PATH.MEDI.CONFERENCE.ENTERPRISE.CREATE}
              startIcon={<PlusIcon />}
              variant="contained"
            >
              Enterprise 학회 등록
            </Button>
          </div>*/}
        </Stack>

        <Card>
          {/*<JoinAttendeeListFilters filters={searchParams} />*/}
          <TableBody<JoinAttendeeDtVo>
            data={data.content}
            columns={columns}
            selectable={false}
            hideHead={false}
            uniqueRowId={'attendeeIdx'}
            isHover={true}
            size="medium"
          />
          <TablePagination count={data.totalCount as number} />
        </Card>
      </Stack>
    </Box>
  );
};

export default JoinAttendeeList;
