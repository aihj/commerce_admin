'use client';

import React, { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { EnterpriseListResVo } from '@/api/types/enterpriseListResVo';
import TableBody from '@/components/core/table/TableBody';
import { TablePagination } from '@/components/core/table/TablePagination';
import { mergeSearchParams } from '@/lib/table';
import RouterLink from 'next/link';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PATH } from '@/paths';
import { EnterpriseListFilters } from '@/components/conferences/EnterpriseListFilters';
import { logger } from '@/lib/logger/defaultLogger';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getJoinAttendeeDt } from '@/api/attendeeApi';
import { selectConferenceIdx } from '@/redux/slices/pcoSlice';
import { useSelector } from 'react-redux';
interface Filter {
  searchParams: SearchParamsType;
}

export interface SearchParamsType {
  currentPage?: number;
  rowsPerPage?: number;

  sortType?: string; // 어떤 타입을 가지고 정렬 할 것인지
  sortDir?: 'asc' | 'desc'; // 어떤 방향으로 정렬할 것인지

  birthYearStart?: string;
  birthYearEnd?: string;
  gender?: string;
  wuserStatus?: string; // 회원 상태
  registrationStatus?: string; // 등록 상태
}

const JoinAttendeeList = ({ searchParams }: Filter) => {
  const { confStringIdx } = useParams();
  const conferenceIdx = useSelector(selectConferenceIdx);
  const router = useRouter();

  // 유저 상세 페이지로 이동하기
  function moveUserDetail(attendeeIdx) {
    router.push(PATH.EACH.USER.ATTENDEE.DETAIL(confStringIdx, attendeeIdx));
  }

  const columnHelper = createColumnHelper();
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: '이름',
        cell: (info) => (
          <div className="flex flex-row text-left">
            <Button
              size="small"
              variant="outlined"
              color="success"
              onClick={() => moveUserDetail(info.row.original.attendeeIdx)}
              title={`${info.row.original.name}`}
            >
              {`${info.getValue()}`}
            </Button>
          </div>
        ),
      }),
      columnHelper.accessor('birthYear', {
        header: '생년',
        cell: (info) => (
          <Button
            size="small"
            className="text-center va"
            // onClick={() =>
            //   moveCommitteeDetail(info.row.original.conferenceStringIdx)
            // }
          >
            {info.getValue()}
          </Button>
        ),
        size: 200,
      }),
      columnHelper.display({
        header: '성별',
        cell: (info) => {
          if (info.row.original.gender === 'F') {
            return (
              <div className="text-center va text-sm">
                {info.getValue()}
                <Chip label="남성" color="primary" />
              </div>
            );
          } else {
            return <div className="text-center va text-sm">여성</div>;
          }
        },
        size: 110,
      }),

      columnHelper.accessor('phone', {
        header: '휴대폰 번호',
        cell: (info) => {
          return <div className="text-center va">{info.getValue()}</div>;
        },
        size: 110,
      }),
      columnHelper.accessor('email', {
        header: '이메일',
        cell: (info) => {
          return (
            <div className="text-center va text-sm">{info.getValue()}</div>
          );
        },
        size: 110,
      }),
      columnHelper.display({
        header: '회원상태',
        cell: (info) => {
          if (info.row.original.wuserStatus === 'active') {
            return (
              <div className="text-center va text-sm">
                <Chip label="회원" color="primary" />
              </div>
            );
          } else if (info.row.original.wuserStatus === 'temp') {
            return <div className="text-center va text-sm">기회원</div>;
          } else {
            return <div className="text-center va text-sm">탈퇴</div>;
          }
        },
        size: 110,
      }),
      columnHelper.accessor('wuserCreateT', {
        header: '가입 날짜',
        cell: (info) => {
          return (
            <div className="text-center va text-sm">{info.getValue()}</div>
          );
        },
        size: 110,
      }),
      columnHelper.display({
        header: '등록 상태',
        cell: (info) => {
          if (info.row.original.registrationStatus === 'active') {
            return (
              <div className="text-center va text-sm">
                <Chip label="사전 등록" color="primary" />
              </div>
            );
          } else if (info.row.original.registrationStatus === 'temp') {
            return <div className="text-center va text-sm">현장 등록</div>;
          } else {
            return <div className="text-center va text-sm">미등록</div>;
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
            <Typography variant="h4">Enterprise 학회 목록</Typography>
          </Box>
          <div>
            <Button
              component={RouterLink}
              href={PATH.MEDI.CONFERENCE.ENTERPRISE.CREATE}
              startIcon={<PlusIcon />}
              variant="contained"
            >
              Enterprise 학회 등록
            </Button>
          </div>
        </Stack>

        <Card>
          <EnterpriseListFilters filters={searchParams} />
          <TableBody<EnterpriseListResVo>
            data={data.content}
            columns={columns}
            selectable={false}
            hideHead={false}
            uniqueRowId={'conferenceIdx'}
            isHover={true}
            size="medium"
          />
          <TablePagination count={data.totalCount} />
        </Card>
      </Stack>
    </Box>
  );
};

export default JoinAttendeeList;
