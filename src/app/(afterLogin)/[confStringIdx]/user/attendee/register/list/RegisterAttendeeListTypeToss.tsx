import { useSelector } from 'react-redux';
import { selectConferenceIdx } from '@/redux/slices/pcoSlice';
import React, { useCallback, useMemo } from 'react';
import useCustomSearchParams from '@/hooks/useCustomSearchParams';
import { PATH } from '@/paths';
import { createColumnHelper } from '@tanstack/react-table';
import TableBody from '@/components/core/table/TableBody';
import { RegisterAttendeeDtVo } from '@/api/types/attendeeTypes';
import { TablePagination } from '@/components/core/table/TablePagination';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import { TableSearchParams } from '@/api/types/tableSearchParams';
import { useParams, useRouter } from 'next/navigation';
import { Box, Button, Card, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getRegisterAttendeeDtTypeToss } from '@/api/attendeeApi';
import { RegisterAttendeeListTypeTossFilters } from '@/app/(afterLogin)/[confStringIdx]/user/attendee/register/list/RegisterAttendeeListTypeTossFilters';
import { FilterPlusActionButtons } from '@/app/(afterLogin)/[confStringIdx]/user/attendee/register/list/FilterPlusActionButtons';

type RegisterAttendeeListTypeTossTypes = NonNullable<unknown>;

export interface RegisterAttendeeListTypeTossSearchParamsType
  extends TableSearchParams {
  birthDateStartT?: string | undefined;
  birthDateEndT?: string;
  gender?: 'F' | 'N';
  registrationStatus?: 'preRegi' | 'onSiteRegi' | 'cancelled'; // 등록 상태
  paymentStatus?: string;
  paymentMethod?: string;
  wuserStatus?: 'prospective' | 'active' | 'delete'; // 회원 상태
  hasMemo?: boolean;
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
        conferenceIdx,
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
                title={`${info.row.original.wuserIdx}`}
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
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  여성
                </Box>
              );
            } else {
              return (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  남성
                </Box>
              );
            }
          },
          size: 110,
        }),

        // (기본 프로그램 등록 기준, 추후 추가 프로그램 현장등록했다고 해도 사전등록으로 인정)
        columnHelper.accessor('registrationStatus', {
          header: '등록구분',
          cell: (info) => {
            switch (info.row.original.registrationStatus) {
              case 'preRegi':
                return (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    사전 등록
                  </Box>
                );
              case 'onSiteRegi':
                return (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    현장 등록
                  </Box>
                );
              case 'cancelled':
                return (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    등록 취소
                  </Box>
                );
            }
          },
          size: 110,
        }),
        columnHelper.display({
          header: '결제 상태',
          cell: (info) => {
            switch (info.row.original.paymentStatus) {
              case 'freeRegi':
                return (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    무료 등록
                  </Box>
                );
              case 'freeRegiCancelled':
                return (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    무료 등록 취소
                  </Box>
                );
              case 'paymentCompleted':
                return (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    결제 완료
                  </Box>
                );
              case 'refundCompleted':
                return (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    환불 완료
                  </Box>
                );
              case 'pendingPayment':
                return (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    결제 대기
                  </Box>
                );
            }
          },
          size: 110,
        }),
        columnHelper.accessor('paymentMethod', {
          header: '결제수단',
          cell: (info) => {
            switch (info.row.original.paymentMethod) {
              case 'card':
                return (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    카드
                  </Box>
                );
              case 'eWallet':
                return (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    간편 결제
                  </Box>
                );
              case 'free':
                return (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    무료 결제
                  </Box>
                );
              case 'manual':
                return (
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    수동 계좌이체
                  </Box>
                );
            }
          },
          size: 110,
        }),

        // TODO : 현재 해당값 없음
        columnHelper.accessor('additionalPaidPrograms', {
          header: '추가 결제',
          cell: () => {
            return (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>-</Box>
            );
          },
          size: 110,
        }),
        columnHelper.accessor('amount', {
          header: '총 금액',
          cell: (info) => {
            return (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {info.getValue()}
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
                {info.getValue()}
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
            <FilterPlusActionButtons />
            <RegisterAttendeeListTypeTossFilters
              cSearchParams={
                cSearchParams as RegisterAttendeeListTypeTossSearchParamsType
              }
              setCSearchParamsFunc={setCSearchParamsFunc}
              deleteCSearchParams={deleteCSearchParams}
            />
            <TableBody<RegisterAttendeeDtVo>
              data={data.content}
              columns={columns}
              selectable={false}
              hideHead={false}
              uniqueRowId={(row: RegisterAttendeeDtVo) =>
                row.attendeeIdx as number
              }
              isHover={true}
              size="medium"
            />
            <TablePagination<RegisterAttendeeListTypeTossSearchParamsType>
              cSearchParams={
                cSearchParams as RegisterAttendeeListTypeTossSearchParamsType
              }
              setCSearchParamsFunc={setCSearchParamsFunc}
              totalCount={data.totalCount as number}
            />
          </Card>
        </Stack>
      </Box>
    );
  };
export { RegisterAttendeeListTypeToss };
