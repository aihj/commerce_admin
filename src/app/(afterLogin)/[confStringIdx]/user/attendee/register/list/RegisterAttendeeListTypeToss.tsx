import { useSelector } from 'react-redux';
import { selectConferenceIdx } from '@/redux/slices/pcoSlice';
import React, { useCallback, useMemo } from 'react';
import useCustomSearchParams from '@/hooks/useCustomSearchParams';
import { PATH } from '@/paths';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import TableBody from '@/components/core/table/TableBody';
import {
  PAYMENT_SOURCE,
  REGISTRATION_STATUS,
  RegisterAttendeeDtVo,
  genderLabels,
  paymentSourceLabels,
  paymentStatusLabels,
  registrationStatusLabels,
} from '@/api/types/attendeeTypes';
import { TablePagination } from '@/components/core/table/TablePagination';
import { TableSearchParams } from '@/api/types/tableSearchParams';
import { useParams, useRouter } from 'next/navigation';
import { Box, Button, Card, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getRegisterAttendeeDtTypeToss } from '@/api/attendeeApi';
import { RegisterAttendeeListTypeTossFilters } from '@/app/(afterLogin)/[confStringIdx]/user/attendee/register/list/RegisterAttendeeListTypeTossFilters';
import { DownloadIcon } from '@/components/icons/DownloadIcon';
import { numberWithComma } from '@/lib/numberWithComma';
import { MemoIcon } from '@/components/icons/MemoIcon';
import { registrationStatusColor } from '../../libs';

type RegisterAttendeeListTypeTossTypes = NonNullable<unknown>;

export interface RegisterAttendeeListTypeTossSearchParamsType
  extends TableSearchParams {
  birthDateStartT?: string | undefined;
  birthDateEndT?: string;
  gender?: 'F' | 'N';
  registrationStatus?: REGISTRATION_STATUS; // 등록 상태
  paymentStatus?: string;
  paymentSource?: string;
  wuserStatus?: 'prospective' | 'active' | 'delete'; // 회원 상태
  hasMemo?: 'y' | 'n';
}

const RegisterAttendeeListTypeToss =
  // eslint-disable-next-line no-empty-pattern
  ({}: RegisterAttendeeListTypeTossTypes) => {
    const { confStringIdx } = useParams();
    const conferenceIdx = useSelector(selectConferenceIdx);
    const router = useRouter();

    // region ***************** params 동기화 *****************
    const initSearchParam = useMemo((): TableSearchParams => {
      return {
        conferenceIdx: conferenceIdx as number,
        currentPage: 0,
        rowsPerPage: 10,
        sortType: 'tbl_conference_attendee.attendee_idx',
        sortDir: 'desc',
      };
    }, [conferenceIdx]);
    const { cSearchParams, setCSearchParamsFunc, deleteCSearchParams } =
      useCustomSearchParams<TableSearchParams>(initSearchParam);
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

    const columnHelper = createColumnHelper<RegisterAttendeeDtVo>();
    const columns = useMemo(
      () => [
        columnHelper.accessor('wuserIdx', {
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
                  moveUserDetail(info.row.original.wuserIdx as number)
                }
                title={`${info.row.original.wuserIdx}`}
              >
                {`${info.getValue()}`}
              </Button>
            </Box>
          ),
          maxSize: 2,
        }),
        columnHelper.accessor('name', {
          // header: () => (
          //   <span
          //     onClick={() => {
          //       setCSearchParamsFunc({
          //         ...cSearchParams,
          //         sortDir: cSearchParams.sortDir === 'desc' ? 'asc' : 'desc',
          //       });
          //     }}
          //   >
          //     이름 {cSearchParams.sortDir === 'desc' ? 'desc' : 'asc'}
          //   </span>
          // ),
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
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {info.row.getValue('birthDate')}
            </Box>
          ),
          size: 10,
        }),
        columnHelper.display({
          header: '성별',
          cell: (info) => (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {genderLabels[info.row.original.gender]}
            </Box>
          ),
          size: 60,
        }),

        // (기본 프로그램 등록 기준, 추후 추가 프로그램 현장등록했다고 해도 사전등록으로 인정)
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
        columnHelper.display({
          header: '결제 상태',
          cell: (info) => (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {paymentStatusLabels[info.row.original.paymentStatus]}
            </Box>
          ),
          size: 110,
        }),
        columnHelper.display({
          header: '결제 수단',
          cell: (info) => (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {info.row.original.paymentSource === null
                ? '-'
                : paymentSourceLabels[
                    info.row.original.paymentSource as PAYMENT_SOURCE
                  ]}
            </Box>
          ),
          size: 110,
        }),
        columnHelper.display({
          header: '등록 구분',
          cell: (info) => (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {info.row.original.regifeeName}
            </Box>
          ),
          size: 110,
        }),

        // TODO : 현재 해당값 없음
        // columnHelper.accessor('additionalPaidPrograms', {
        //   header: '추가 결제',
        //   cell: () => {
        //     return (
        //       <Box sx={{ display: 'flex', justifyContent: 'center' }}>-</Box>
        //     );
        //   },
        //   size: 110,
        // }),
        columnHelper.accessor('amount', {
          header: '총 금액',
          cell: (info) => {
            return (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {info.getValue() === null ? '-' : info.getValue()}
              </Box>
            );
          },
          size: 110,
        }),
        columnHelper.accessor('indicatedAmount', {
          header: '결제 금액',
          cell: (info) => {
            return (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {info.getValue() === null ? '-' : info.getValue()}
              </Box>
            );
          },
          size: 110,
        }),

        // TODO : 응급의학회의 경우 해당 값 존재 안함
        columnHelper.accessor('registrationAt', {
          header: '등록 날짜',
          cell: (info) => {
            return (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {info.getValue() === null ? '-' : info.getValue()}
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
      queryKey: ['getRegisterAttendeeDtTypeToss', cSearchParams],
      queryFn: () =>
        getRegisterAttendeeDtTypeToss(
          cSearchParams as RegisterAttendeeListTypeTossSearchParamsType
        ),
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
          </Stack>

          <Card>
            <RegisterAttendeeListTypeTossFilters
              cSearchParams={
                cSearchParams as RegisterAttendeeListTypeTossSearchParamsType
              }
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
            <TableBody<RegisterAttendeeDtVo>
              data={data.content}
              columns={columns as ColumnDef<RegisterAttendeeDtVo>[]}
              selectable={false}
              hideHead={false}
              uniqueRowId={(row: RegisterAttendeeDtVo) =>
                row.attendeeIdx as number
              }
              isHover={true}
              // size="medium"
            />
            <TablePagination<RegisterAttendeeListTypeTossSearchParamsType>
              cSearchParams={
                cSearchParams as RegisterAttendeeListTypeTossSearchParamsType
              }
              setCSearchParamsFunc={setCSearchParamsFunc}
              totalCount={data.totalCount as unknown as number}
            />
          </Card>
        </Stack>
      </Box>
    );
  };
export { RegisterAttendeeListTypeToss };
