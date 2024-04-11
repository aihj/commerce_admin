'use client';

import React, { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useGetEnterprisePcoList } from '@/api/pco/pco';
import { EnterpriseListResVo } from '@/api/types/EnterpriseListResVo';
import TableBody from '@/components/core/table/TableBody';
import { TablePagination } from '@/components/core/table/TablePagination';
// import EnterpriseListFilters from '@/app/(afterLogin)/test/mui-table/EnterpriseListFilters';
import { mergeSearchParams } from '@/lib/table';
import RouterLink from 'next/link';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PATH } from '@/paths';
import { useSearchParams } from 'next/navigation';

// interface Filter {
//   searchParams: SearchParamsType;
// }

// export interface SearchParamsType {
//   currentPage?: number;
//   rowsPerPage?: number;
//
//   sortType?: string; // 어떤 타입을 가지고 정렬 할 것인지
//   sortDir?: 'asc' | 'desc'; // 어떤 방향으로 정렬할 것인지
// }

const PcoProgramList = () => {
  const searchParams = useSearchParams();
  const columnHelper = createColumnHelper();
  const columns = useMemo(
    () => [
      // columnHelper.accessor("confName", {
      //   header: "학회 이름(학회 단체)",
      //   cell: info => <Button
      //     variant="primary"
      //   >
      //     {info.getValue()}
      //   </Button>,
      // }),
      columnHelper.accessor('session_category_date', {
        header: 'category date',
        cell: (info) => (
          <div className="flex justify-center">{info.getValue()}</div>
        ),
        size: 110,
      }),
      columnHelper.accessor('session_category_title', {
        header: 'category',
        cell: (info) => (
          <div className="flex justify-center">
            <Button
              variant="primary"
              onClick={() =>
                moveProgramDetail(info.row.original.session_category_idx)
              }
              className="text-center va"
            >
              {info.getValue()}
            </Button>
          </div>
        ),
        size: 110,
      }),
      columnHelper.accessor('session_group_title', {
        header: 'session name',
        cell: (info) => (
          <div className="flex justify-center">
            <Button
              variant="primary"
              className="text-center va"
              onClick={() =>
                moveSessionGroupDetail(info.row.original.session_group_idx)
              }

              // id={`sessionDetailModal_${info.row.original.session_group_idx}`}
              // onClick={openModal}
            >
              {info.getValue()}
            </Button>

            {/* 세션 그룹 상세 페이지 모달 */}
            {/*<Modal*/}
            {/*  // cl="left"*/}
            {/*  id={`sessionDetailModal_${info.row.original.session_group_idx}`}*/}
            {/*  openedModals={state.openedModals}*/}
            {/*  header="강의 안내"*/}
            {/*>*/}
            {/*  <A_SessionGroupDetail*/}
            {/*    sessionGroup={info.row.original}/>*/}
            {/*</Modal>*/}
          </div>
        ),
      }),
      columnHelper.accessor('session_group_start_t', {
        header: 'session start time',
        cell: (info) => <div className="text-center va">{info.getValue()}</div>,
        size: 90,
      }),
      columnHelper.accessor('session_group_end_t', {
        header: 'session end time',
        cell: (info) => <div className="text-center va">{info.getValue()}</div>,
        size: 90,
      }),
      columnHelper.accessor('location_name', {
        header: 'session location',
        size: 50,
        cell: (info) => <div className="text-center va">{info.getValue()}</div>,
      }),
      columnHelper.accessor('sessionGroupFaculties', {
        header: 'session faculty',
        size: 50,
        cell: (info) => (
          <div className="text-center va">
            {info.getValue().map((item, index) => (
              <Button
                key={index}
                variant="primary"
                className="btn-sm"
                onClick={() => goFaculty(info.row.original.session_group_idx)}
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
    []
  );
  // endregion ****************************** 열 구성 설정 ******************************
  const filterInitialData = {
    confStringIdx: searchParams.get('confStringIdx'),
    currentPage: 0,
    rowsPerPage: 10,

    sortType: 'conference_idx',
    sortDir: 'desc',
  };
  const mergedSearchParams = mergeSearchParams(searchParams, filterInitialData);
  const { data, isLoading, isError } = useGetEnterprisePcoList({
    ...mergedSearchParams,
  });
  // window.data = data;
  // **********************************************************
  if (isLoading) return <div>Loading...</div>;
  if (isError || !data) return <div>Error fetching data</div>;
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
              href={PATH.CONFERENCE.ENTERPRISE.CREATE}
              startIcon={<PlusIcon />}
              variant="contained"
            >
              Enterprise 학회 등록
            </Button>
          </div>
        </Stack>

        <Card>
          {/*<EnterpriseListFilters filters={searchParams} />*/}
          <TableBody<EnterpriseListResVo>
            data={data}
            columns={columns}
            selectable={false}
            hideHead={false}
            uniqueRowId={'conferenceIdx'}
            isHover={true}
            size="medium"
          />
          <TablePagination count={data.length} />
        </Card>
      </Stack>
    </Box>
  );
};

export default PcoProgramList;
