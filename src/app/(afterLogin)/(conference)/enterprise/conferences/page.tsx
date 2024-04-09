'use client';

import React, { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useGetEnterprisePcoList } from '@/api/pco/pco';
import { EnterpriseListResVo } from '@/api/types/EnterpriseListResVo';
import TableBody from '@/components/core/table/TableBody';
import { TablePagination } from '@/components/core/table/TablePagination';
import { mergeSearchParams } from '@/lib/table';
import RouterLink from 'next/link';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { PATH } from '@/paths';
import EnterpriseListFilters from '@/app/(afterLogin)/(conference)/enterprise/conferences/EnterpriseListFilters';

interface Filter {
  searchParams: SearchParamsType;
}

export interface SearchParamsType {
  currentPage?: number;
  rowsPerPage?: number;

  sortType?: string; // 어떤 타입을 가지고 정렬 할 것인지
  sortDir?: 'asc' | 'desc'; // 어떤 방향으로 정렬할 것인지

  committeeName?: string;
  conferenceName?: string;
  conferenceStartT?: string;
  conferenceEndT?: string;
}

const EnterpriseList = ({ searchParams }: Filter) => {
  const columnHelper = createColumnHelper();
  const columns = useMemo(
    () => [
      columnHelper.accessor('conferenceName', {
        header: '학회',
        cell: (info) => (
          <div className="flex flex-row text-left">
            <Button
              size="small"
              variant="outlined"
              color="success"
              // onClick={() =>
              //   moveConferencePage(info.row.original.conferenceStringIdx)
              // }
              title={`${info.row.original.conferenceIdx}`}
            >
              {`${info.getValue()}`}
            </Button>
          </div>
        ),
      }),
      columnHelper.accessor('committeeName', {
        header: '사무국',
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
      columnHelper.accessor('conferencePreRegiStartT', {
        header: '사전 등록 시작',
        cell: (info) => {
          return <div className="text-center va">{info.getValue()}</div>;
        },
        size: 110,
      }),
      columnHelper.accessor('conferencePreRegiEndT', {
        header: '사전 등록 종료',
        cell: (info) => {
          return (
            <div className="text-center va text-sm">{info.getValue()}</div>
          );
        },
        size: 110,
      }),
      columnHelper.accessor('conferenceStartT', {
        header: '학회 시작 일정',
        cell: (info) => {
          return (
            <div className="text-center va text-sm">{info.getValue()}</div>
          );
        },
        size: 110,
      }),
      columnHelper.accessor('conferenceEndT', {
        header: '학회 종료 일정',
        cell: (info) => {
          return (
            <div className="text-center va text-sm">{info.getValue()}</div>
          );
        },
        size: 110,
      }),
      columnHelper.accessor('locationName', {
        header: '개최 주소',
        cell: (info) => {
          if (info.row.original.isOnline === 'y') {
            return (
              <div className="text-center va text-sm">
                {info.getValue()}
                <Chip label="온라인 지원" color="primary" />
              </div>
            );
          } else {
            return (
              <div className="text-center va text-sm">{info.getValue()}</div>
            );
          }
        },
        size: 110,
      }),
      columnHelper.accessor('homeUrl', {
        header: '학회 Url',
        cell: (info) => (
          <Button
            size="small"
            className="text-center va"
            onClick={() => window.open(info.row.original.homeUrl)}
          >
            {info.getValue()}
          </Button>
        ),
        size: 110,
      }),
      columnHelper.accessor('templateType', {
        header: '템플릿 타입',
        cell: (info) => {
          const statusValue = info.row.original.templateType; // 데이터의 상태값 가져오기
          if (statusValue === 'simple')
            return <div className="label green small">심플</div>;
          else if (statusValue === 'a-type')
            return <div className="label blue small">템플릿 A 타입</div>;
          else if (statusValue === 'b-type')
            return <div className="label grey small">템플릿 B 타입</div>;
        },
        size: 95,
      }),
      columnHelper.accessor('clientOpenStatus', {
        header: 'client 페이지 상태',
        cell: (info) => {
          const statusValue = info.row.original.clientOpenStatus; // 데이터의 상태값 가져오기
          if (statusValue === 'active')
            return <div className="label green small">Open</div>;
          else return <div className="label green small">Close</div>;
        },
        size: 100,
      }),
      columnHelper.accessor('adminOpenStatus', {
        header: 'admin 페이지 상태',
        cell: (info) => {
          const statusValue = info.row.original.adminOpenStatus; // 데이터의 상태값 가져오기
          if (statusValue === 'active')
            return <div className="label green small">Open</div>;
          else return <div className="label green small">Close</div>;
        },
        size: 100,
      }),
    ],
    [columnHelper]
  );
  // endregion ****************************** 열 구성 설정 ******************************
  const filterInitialData = {
    currentPage: 0,
    rowsPerPage: 10,

    sortType: 'tbl_conference.conference_idx',
    sortDir: 'desc',
  };
  console.log('searchParams', searchParams);
  const mergedSearchParams = mergeSearchParams(searchParams, filterInitialData);
  const { data, isLoading, isError } = useGetEnterprisePcoList({
    ...mergedSearchParams,
  });
  // window.data = data;
  // **********************************************************
  if (isLoading) return <div>Loading...</div>;
  if (isError || !data.content || !data.totalCount)
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
              href={PATH.CONFERENCE.ENTERPRISE.CREATE}
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

export default EnterpriseList;
