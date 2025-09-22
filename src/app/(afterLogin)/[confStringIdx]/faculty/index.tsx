'use client';

import {
  FACULTY_STATUS,
  GetFacultiesResponse,
  facultyStatusLabels,
} from '@/api/types/facultyTypes';
import { TableSearchParams } from '@/api/types/tableSearchParams';
import { DTCellBox } from '@/components/DTCellBox';
import { Loading } from '@/components/core/Loading';
import { PageTitle } from '@/components/core/PageTitle';
import TableBody from '@/components/core/table/TableBody';
import { TablePagination } from '@/components/core/table/TablePagination';
import useCustomSearchParams from '@/hooks/useCustomSearchParams';
import { InitSearchParam } from '@/lib/InitSearchParams';
import {
  selectConferenceIdx,
  selectConferenceStringIdx,
} from '@/redux/slices/pcoSlice';
import { useSelector } from '@/redux/store';
import { Box, Button, Card, Stack } from '@mui/material';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react';
import { FacultyFiltersType, FacultyListFilters } from './FacultyListFilters';
import { useQuery } from '@tanstack/react-query';
import { getFaculties } from '@/api/facultyApi';
import { logger } from '@/lib/logger/defaultLogger';
import { useRouter } from 'next/navigation';
import { PATH } from '@/paths';
import { CHIP_COLOR, Chip } from '@/components/core/Chip';

const FacultyList = () => {
  const router = useRouter();
  const conferenceStringIdx = useSelector(selectConferenceStringIdx);
  const [totalCount, setTotalCount] = useState<number>(0);

  const columnHelper = createColumnHelper<GetFacultiesResponse>();

  const conferenceIdx = useSelector(selectConferenceIdx);

  const moveFacultyDetail = (facultyIdx: number) => {
    router.push(
      PATH.EACH.FACULTY.DETAIL(conferenceStringIdx, String(facultyIdx))
    );
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor('facultyIdx', {
        header: '고유번호',
        cell: (info) => {
          return (
            <DTCellBox>
              <Button
                color="secondary"
                sx={{
                  border: 0,
                  textDecoration: 'underline',
                  textUnderlinePosition: 'under',
                }}
                onClick={() => {
                  moveFacultyDetail(info.row.original.facultyIdx);
                }}
                title={`${info.row.original.facultyIdx}`}
              >
                {`${info.getValue()}`}
              </Button>
            </DTCellBox>
          );
        },
        size: 60,
      }),
      // columnHelper.accessor('profileUrl', {
      //   header: '프로필',
      //   cell: (info) => {
      //     return (
      //       <DTCellBox>
      //         <div>
      //           {info.getValue() ? (
      //             <Image
      //               src={info.getValue() as string}
      //               alt={`연자 프로필-${info.row.getValue('name')}`}
      //               width={32}
      //               height={32}
      //             />
      //           ) : (
      //             '-'
      //           )}
      //         </div>
      //       </DTCellBox>
      //     );
      //   },
      //   size: 60,
      // }),
      columnHelper.accessor('name', {
        header: '이름',
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
                  moveFacultyDetail(info.row.original.facultyIdx);
                }}
                title={`${info.row.original.facultyIdx}`}
              >
                {info.getValue()}
              </Button>
            </DTCellBox>
          );
        },
        size: 60,
      }),
      columnHelper.accessor('affiliation', {
        header: '소속',
        cell: (info) => {
          return (
            <DTCellBox>
              <span>{info.getValue() ?? '-'}</span>
            </DTCellBox>
          );
        },
        size: 100,
      }),
      columnHelper.accessor('position', {
        header: '직책',
        cell: (info) => {
          return (
            <DTCellBox>
              <span>{info.getValue() ?? '-'}</span>
            </DTCellBox>
          );
        },
        size: 100,
      }),
      columnHelper.accessor('status', {
        header: '노출 여부',
        cell: (info) => {
          return (
            <DTCellBox>
              <Chip
                type="soft"
                color={
                  info.getValue() === FACULTY_STATUS.active
                    ? CHIP_COLOR.warning
                    : CHIP_COLOR.secondary
                }
                label={facultyStatusLabels[info.getValue()]}
              />
            </DTCellBox>
          );
        },
        size: 60,
      }),
    ],
    [columnHelper]
  );

  const initSearchParam = InitSearchParam(
    conferenceIdx as number,
    '',
    'desc',
    20
  );

  const { cSearchParams, setCSearchParamsFunc, deleteCSearchParams } =
    useCustomSearchParams<TableSearchParams>(initSearchParam);

  const { data, isPending } = useQuery({
    queryKey: ['getFaculties', cSearchParams],
    queryFn: () =>
      getFaculties(cSearchParams)
        .then((result) => {
          setTotalCount(result.totalCount as number);
          return result.content;
        })
        .catch((error) => {
          logger.error('<getFaculties error>', error);
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
            <PageTitle title="연자 목록" />
          </Box>
          <Button
            onClick={() =>
              router.push(PATH.EACH.FACULTY.ADD(conferenceStringIdx))
            }
            variant="contained"
            color="secondary"
          >
            등록하기
          </Button>
        </Stack>
        <Card>
          <FacultyListFilters
            cSearchParams={cSearchParams}
            setSearchParams={setCSearchParamsFunc}
            deleteSearchParams={deleteCSearchParams}
          />
          <TableBody<GetFacultiesResponse>
            data={data as GetFacultiesResponse[]}
            columns={columns as ColumnDef<GetFacultiesResponse>[]}
            selectable={false}
            hideHead={false}
            uniqueRowId={(row: GetFacultiesResponse) =>
              row.facultyIdx as number
            }
            isHover={true}
            noDataMessage={'등록된 연자가 없습니다.'}
          />
          <TablePagination<FacultyFiltersType>
            cSearchParams={cSearchParams as FacultyFiltersType}
            setCSearchParamsFunc={setCSearchParamsFunc}
            totalCount={totalCount}
          />
        </Card>
      </Stack>
    </Box>
  );
};

export { FacultyList };
