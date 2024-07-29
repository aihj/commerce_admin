'use client';

import React, { useCallback, useMemo } from 'react';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
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
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import TableBody from '@/components/core/table/TableBody';
import { JoinAttendeeDtVo } from '@/api/types/attendeeTypes';
import { TablePagination } from '@/components/core/table/TablePagination';
import { JoinAttendeeListFilters } from '@/app/(afterLogin)/[confStringIdx]/user/attendee/join/list/JoinAttendeeListFilters';
import useCustomSearchParams from '@/hooks/useCustomSearchParams';
import { TableSearchParams } from '@/api/types/tableSearchParams';

export interface JoinAttendeeListSearchParamsType extends TableSearchParams {
  birthDateStartT?: string | undefined;
  birthDateEndT?: string;
  gender?: string;
  registrationStatus?: 'not_registered' | 'pre' | 'onsite'; // 등록 상태
  wuserStatus?: 'temp' | 'active' | 'delete'; // 회원 상태
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

  const columnHelper = createColumnHelper<JoinAttendeeDtVo>();
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
              onClick={() =>
                moveUserDetail(info.row.original.attendeeIdx as number)
              }
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
  // const currentLink: string = useMemo(
  //   () => `${PATH.EACH.USER.ATTENDEE.JOIN_LIST(confStringIdx)}`,
  //   [confStringIdx]
  // );

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
          <JoinAttendeeListFilters
            cSearchParams={cSearchParams as JoinAttendeeListSearchParamsType}
            setCSearchParamsFunc={setCSearchParamsFunc}
            deleteCSearchParams={deleteCSearchParams}
          />
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
