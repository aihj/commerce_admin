import { useSelector } from 'react-redux';
import { selectConferenceIdx } from '@/redux/slices/pcoSlice';
import React, { useCallback, useMemo } from 'react';
import useCustomSearchParams from '@/hooks/useCustomSearchParams';
import { PATH } from '@/paths';
import { createColumnHelper } from '@tanstack/react-table';
import {
  attendeePaymentManualStatusChange,
  getRegisterAttendeeDtTypeManual,
} from '@/api/attendeeApi';
import { RegisterAttendeeListTypeManualFilters } from '@/app/(afterLogin)/[confStringIdx]/user/attendee/register/list/RegisterAttendeeListTypeManualFilters';
import TableBody from '@/components/core/table/TableBody';
import { RegisterAttendeeDtVo } from '@/api/types/attendeeTypes';
import { TablePagination } from '@/components/core/table/TablePagination';

import { TableSearchParams } from '@/api/types/tableSearchParams';
import { useParams, useRouter } from 'next/navigation';
import { Box, Button, Card, Select, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import { AttendeePaymentManualVo } from '@/types/user';
import { checkRefundAmount } from '@/api/publicApi';
import { Option } from '@/components/core/option';

type RegisterAttendeeListTypeTossTypes = NonNullable<unknown>;

export interface RegisterAttendeeListTypeManualSearchParamsType
  extends TableSearchParams {
  birthDateStartT?: string | undefined;
  birthDateEndT?: string;
  gender?: 'F' | 'N';
  registrationStatus?: 'preRegi' | 'onSiteRegi' | 'cancelled'; // 등록 상태
  manualPaymentHistory: AttendeePaymentManualVo; // 결제 대기, 결제 확인, 환불 요청, 환불 완료 해당 상태를 하나라도 가지고 있으면 검색 가능하게
  paymentStatus?: string; // 결제 대기, 결제 확인, 환불 요청, 환불 완료 해당 상태를 하나라도 가지고 있으면 검색 가능하게
  wuserStatus?: 'prospective' | 'active' | 'delete'; // 회원 상태
  hasMemo?: boolean;
}

const RegisterAttendeeListTypeManual =
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

    // 수동 계좌이체의 manualStatus 변경
    const changeManualStatus = useCallback(
      async (attendeePaymentIdx, desiredStatus) => {
        if (desiredStatus === 'cancel-completed') {
          await checkRefundAmount(conferenceIdx, attendeePaymentIdx)
            .then(async (result) => {
              // TODO : 해당 부분 confirm으로 변경후 사용자가 ok 누를때에만 아래 함수 추가로 요청
              if (
                confirm(
                  `해당 학회의 환불 요청에 따라 ${result}원이 환불됩니다. 송금 완료 후 환불 완료 상태로로 변경해주세요. 정말로 상태를 변경하시겠습니까?`
                )
              ) {
                await attendeePaymentManualStatusChange(
                  attendeePaymentIdx,
                  desiredStatus
                )
                  .then(() => {
                    refetch();
                    alert('변경 완료');
                  })
                  .catch((error) => {
                    alert(error.response.data.message);
                  });
              }
            })
            .catch((error) => {
              alert(error.response.data.message);
            });
        } else {
          attendeePaymentManualStatusChange(attendeePaymentIdx, desiredStatus)
            .then(() => {
              refetch();
              alert('변경 완료');
            })
            .catch((error) => {
              alert(error.response.data.message);
            });
        }
      },
      [conferenceIdx, refetch]
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
            let paymentDetails;
            if (info.row.original.manualPaymentHistory == null) {
              paymentDetails = '결제 대기';
            } else {
              paymentDetails = info.row.original.manualPaymentHistory.map(
                (item) => {
                  // let paymentStatusItem;
                  //
                  // switch (item.manualStatus) {
                  //   case 'payment-pending':
                  //     paymentStatusItem = '결제 대기';
                  //     break;
                  //   case 'payment-confirmed':
                  //     paymentStatusItem = '결제 확인';
                  //     break;
                  //   case 'cancel-request':
                  //     paymentStatusItem = '환불 요청';
                  //     break;
                  //   case 'cancel-completed':
                  //     paymentStatusItem = '환불 완료';
                  //     break;
                  // }

                  return (
                    <Box
                      key={item.paymentCreateT}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <span>{item.paymentCreateT}</span>
                      <span>{item.amount}</span>
                      <Select
                        name="sort"
                        onChange={(e) =>
                          changeManualStatus(
                            item.attendeePaymentIdx,
                            e.target.value
                          )
                        }
                        sx={{ maxWidth: '100%', width: '120px' }}
                        value={item.manualStatus}
                      >
                        <Option value="payment-pending">결제 대기</Option>
                        <Option value="payment-confirmed">결제 확인</Option>
                        <Option value="cancel-request">취소 요청</Option>
                        <Option value="cancel-completed">취소 완료</Option>
                      </Select>

                      {/*<Button*/}
                      {/*  type="button"*/}
                      {/*  variant="contained"*/}
                      {/*  onClick={() =>*/}
                      {/*    changeManualStatus(item.attendeePaymentIdx)*/}
                      {/*  }*/}
                      {/*>*/}
                      {/*  {paymentStatusItem}*/}
                      {/*</Button>*/}
                    </Box>
                  );
                }
              );
            }

            // Return all the payment details within a parent Box
            return <Box>{paymentDetails}</Box>;
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
    const { isLoading, error, data, refetch } = useQuery({
      queryKey: ['getRegisterAttendeeDtTypeManual', cSearchParams],
      queryFn: () =>
        getRegisterAttendeeDtTypeManual(
          cSearchParams as RegisterAttendeeListTypeManualSearchParamsType
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
            <RegisterAttendeeListTypeManualFilters
              cSearchParams={
                cSearchParams as RegisterAttendeeListTypeManualSearchParamsType
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
            <TablePagination<RegisterAttendeeListTypeManualSearchParamsType>
              cSearchParams={
                cSearchParams as RegisterAttendeeListTypeManualSearchParamsType
              }
              setCSearchParamsFunc={setCSearchParamsFunc}
              totalCount={data.totalCount as number}
            />
          </Card>
        </Stack>
      </Box>
    );
  };
export { RegisterAttendeeListTypeManual };
