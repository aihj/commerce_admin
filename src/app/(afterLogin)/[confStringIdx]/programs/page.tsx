'use client';

import React, { useCallback, useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TableBody from '@/components/core/table/TableBody';
import { TablePagination } from '@/components/core/table/TablePagination';
// import EnterpriseListFilters from '@/app/(afterLogin)/test/mui-table/EnterpriseListFilters';
import { mergeSearchParams } from '@/lib/table';
import RouterLink from 'next/link';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PATH } from '@/paths';
import { useParams, useRouter } from 'next/navigation';
import { useProgramDt } from '@/api/programApi';
import { ProgramDtVo } from '@/api/types/programDtVo';
import { ProgramListFilters } from '@/components/program/ProgramListFilters';

interface Filter {
  searchParams: SearchParamsType;
}

export interface SearchParamsType {
  currentPage?: number;
  rowsPerPage?: number;

  sortType?: string; // 어떤 타입을 가지고 정렬 할 것인지
  sortDir?: 'asc' | 'desc'; // 어떤 방향으로 정렬할 것인지

  sessionCategoryDate?: string;
  sessionCategoryTitle?: string;
  sessionGroupTitle?: string;
  // sessionGroupStartT?: string;
  // sessionGroupEndT?: string;
}

const PcoProgramList = ({ searchParams }: Filter) => {
  const router = useRouter();
  const { confStringIdx } = useParams();
  // TODO : 페이지 이동할때 현재의 쿼리스트링을 그대로 저장하고 이동하고 싶은데

  const moveProgramDetail = useCallback(
    (sessionCategoryIdx) => {
      router.push(`/${confStringIdx}/programs/${sessionCategoryIdx}`);
    },
    [confStringIdx, router]
  );

  // 세션 그룹 상세 + 강의 페이지로 이동
  const moveSessionGroupDetail = useCallback(
    (sessionGroupIdx) => {
      const link = `/${confStringIdx}/programs/session-group/${sessionGroupIdx}`;
      router.push(link);
    },
    [confStringIdx, router]
  );

  const columnHelper = createColumnHelper();
  const columns = useMemo(
    () => [
      columnHelper.accessor('sessionCategoryDate', {
        header: '해당 프로그램 시작일',
        cell: (info) => (
          <div className="flex justify-center">{info.getValue()}</div>
        ),
        size: 110,
      }),
      columnHelper.accessor('sessionCategoryTitle', {
        header: '카테고리',
        cell: (info) => (
          <div className="flex justify-center">
            <Button
              variant="primary"
              onClick={() =>
                moveProgramDetail(info.row.original.sessionCategoryIdx)
              }
              className="text-center va"
            >
              {info.getValue()}
            </Button>
          </div>
        ),
        size: 110,
      }),
      columnHelper.accessor('sessionGroupTitle', {
        header: '세션',
        cell: (info) => (
          <div className="flex justify-center">
            <Button
              color="success"
              variant="outlined"
              onClick={() =>
                moveSessionGroupDetail(info.row.original.sessionGroupIdx)
              }
            >
              {info.getValue()}
            </Button>
          </div>
        ),
      }),
      columnHelper.accessor('sessionGroupStartT', {
        header: '세션 시작 시간',
        cell: (info) => <div className="text-center va">{info.getValue()}</div>,
        size: 90,
      }),
      columnHelper.accessor('sessionGroupEndT', {
        header: '세션 종료 시간',
        cell: (info) => <div className="text-center va">{info.getValue()}</div>,
        size: 90,
      }),
      columnHelper.accessor('locationName', {
        header: '장소',
        size: 50,
        cell: (info) => <div className="text-center va">{info.getValue()}</div>,
      }),
      columnHelper.accessor('sessionGroupFaculties', {
        header: '연자',
        size: 50,
        cell: (info) => (
          <div className="text-center va">
            {info.getValue().map((item, index) => (
              <Button
                key={index}
                variant="primary"
                className="btn-sm"
                onClick={() => goFaculty(info.row.original.sessionGroupIdx)}
              >
                {item?.conferenceUserName}({item?.facultyProgramRole})
              </Button>
            ))}
          </div>
        ),
        cellProps: {
          style: {
            width: '50px', // 열의 너비 조정
          },
        },
        className: 'w-[50px]', // Tailwind CSS 클래스를 추가하여 너비 조정
      }),
    ],
    [columnHelper, moveProgramDetail, moveSessionGroupDetail]
  );
  // endregion ****************************** 열 구성 설정 ******************************
  const filterInitialData = {
    confStringIdx: confStringIdx,
    currentPage: 0,
    rowsPerPage: 10,

    sortType: 'tbl_conference_session_category.session_category_idx',
    sortDir: 'desc',
  };
  const mergedSearchParams = mergeSearchParams(searchParams, filterInitialData);
  const { data, isLoading, isError } = useProgramDt({
    ...mergedSearchParams,
  });
  window.data = data;
  // **********************************************************
  if (isLoading) return <div>Loading...</div>;
  if (
    isError ||
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
            <Typography variant="h4">프로그램 목록</Typography>
          </Box>
          <div>
            <Button
              component={RouterLink}
              href={PATH.EACH.PROGRAM.CREATE(confStringIdx)}
              startIcon={<PlusIcon />}
              variant="contained"
            >
              프로그램 등록
            </Button>
          </div>
        </Stack>

        <Card>
          <ProgramListFilters filters={searchParams} />
          <TableBody<ProgramDtVo>
            data={data.content}
            columns={columns}
            selectable={false}
            hideHead={false}
            uniqueRowId={'sessionGroupIdx'}
            isHover={true}
            size="medium"
          />
          <TablePagination count={data.totalCount} />
        </Card>
      </Stack>
    </Box>
  );
};

export default PcoProgramList;
