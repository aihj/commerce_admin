import { useSelector } from 'react-redux';
import {
  selectConferenceIdx,
  selectConferenceName,
} from '@/redux/slices/pcoSlice';
import React, { useCallback, useMemo, useState } from 'react';
import useCustomSearchParams from '@/hooks/useCustomSearchParams';
import { PATH } from '@/paths';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import TableBody from '@/components/core/table/TableBody';
import {
  REGISTRATION_STATUS,
  getRegisteredUsersResponse,
  genderLabels,
  registrationStatusLabels,
  PAYMENT_METHOD,
} from '@/api/types/attendeeTypes';
import { TablePagination } from '@/components/core/table/TablePagination';
import { TableSearchParams } from '@/api/types/tableSearchParams';
import { useParams, useRouter } from 'next/navigation';
import { Box, Button, Card, Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import {
  downloadAllUsers,
  getRegisteredUsers,
  getRegistrationType,
} from '@/api/attendeeApi';
import { RegisterAttendeeListTypeTossFilters } from '@/app/(afterLogin)/[confStringIdx]/user/attendee/register/list/RegisterAttendeeListTypeTossFilters';
import { DownloadIcon } from '@/components/icons/DownloadIcon';
import { numberWithComma } from '@/lib/numberWithComma';
import { MemoIcon } from '@/components/icons/MemoIcon';
import { Chip } from '@/components/core/Chip';
import { setRegistrationStatusChipColor } from '@/lib/chipColors';
import { logger } from '@/lib/logger/defaultLogger';
import { InitSearchParam } from '@/lib/InitSearchParams';
import { PageTitle } from '@/components/core/PageTitle';
import { dateFormat, dayjs } from '@/lib/dayjs';

type RegisterAttendeeListTypeTossTypes = NonNullable<unknown>;

export interface RegisterAttendeeListTypeTossSearchParamsType
  extends TableSearchParams {
  birthDateStartT?: string | undefined;
  birthDateEndT?: string;
  gender?: 'F' | 'N';
  regiStatus?: REGISTRATION_STATUS; // 등록 상태
  paymentMethod?: string;
  wuserRoleStatus?: 'prospective' | 'active' | 'delete'; // 회원 상태
  hasMemo?: 'y' | 'n';
  // regifeeIdx: number; // 등록구분
  productName: string;
}

const RegisterAttendeeListTypeToss =
  // eslint-disable-next-line no-empty-pattern
  ({}: RegisterAttendeeListTypeTossTypes) => {
    const { confStringIdx } = useParams();
    const conferenceIdx = useSelector(selectConferenceIdx);
    const conferenceName: string = useSelector(selectConferenceName) as string;
    const router = useRouter();

    const [registrationType, setRegistrationType] = useState<
      {
        value: string;
        label: string;
      }[]
    >([]);

    const initSearchParam = InitSearchParam(
      conferenceIdx as number,
      'tbl_conference_attendee.attendee_idx'
    );

    const { cSearchParams, setCSearchParamsFunc, deleteCSearchParams } =
      useCustomSearchParams<TableSearchParams>(initSearchParam);
    // window.cSearchParams = cSearchParams;
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

    const columnHelper = createColumnHelper<getRegisteredUsersResponse>();
    const columns = useMemo(
      () => [
        columnHelper.accessor('attendeeIdx', {
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
                  moveUserDetail(info.row.original.attendeeIdx as number)
                }
                title={`${info.row.original.attendeeIdx}`}
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
                  moveUserDetail(info.row.original.attendeeIdx as number)
                }
                title={`${info.row.original.attendeeIdx}`}
              >
                <span className="mr-4">{`${info.getValue()}`}</span>
                {info.row.original.memo ? <MemoIcon size={16} /> : ''}
              </Button>
            </Box>
          ),
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
              {info.row.original.gender
                ? genderLabels[info.row.original.gender]
                : '-'}
            </Box>
          ),
          size: 60,
        }),

        // (기본 프로그램 등록 기준, 추후 추가 프로그램 현장등록했다고 해도 사전등록으로 인정)
        columnHelper.display({
          header: '등록상태',
          cell: (info) => (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Chip
                key={info.row.original.regiStatus}
                label={registrationStatusLabels[info.row.original.regiStatus]}
                type="soft"
                color={setRegistrationStatusChipColor(
                  info.row.original.regiStatus
                )}
              />
            </Box>
          ),
          size: 110,
        }),
        columnHelper.display({
          header: '결제수단',
          cell: (info) => (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {info.row.original.paymentMethod === null
                ? '-'
                : PAYMENT_METHOD[info.row.original.paymentMethod]}
            </Box>
          ),
          size: 110,
        }),
        columnHelper.display({
          header: '등록구분',
          cell: (info) => (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {info.row.original.regiName}
            </Box>
          ),
          size: 110,
        }),
        columnHelper.display({
          header: '면허번호',
          cell: (info) => (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              {info.row.original.license ?? '-'}
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
          header: '결제금액',
          cell: (info) => {
            return (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {info.getValue() === null
                  ? '-'
                  : numberWithComma(Number(info.getValue()))}
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

    const handleExcelDownload = () => {
      const date = dateFormat(dayjs(), 'YYMMDD');
      downloadAllUsers(conferenceName, date);
    };

    const { data: getRegistrationTypeData } = useQuery({
      queryKey: ['getRegistrationType', conferenceIdx],
      queryFn: () =>
        getRegistrationType()
          .then((result) => {
            if (result && result.content) {
              const newData = result?.content?.map((item) => ({
                // label: `${item.isPreRegistration ? '(사전)' : '(현장)'} ${item.regifeeName}`,
                // value: item.regifeeIdx,
                label: item,
                value: item,
              }));
              setRegistrationType(newData);
              logger.debug('getRegistrationTypeData', getRegistrationTypeData);
              return result;
            }
          })
          .catch((error) => {
            logger.error('<getRegistrationType error>', error);
          }),
    });

    const { isLoading, error, data } = useQuery({
      queryKey: ['getRegisteredUsers', cSearchParams],
      queryFn: () =>
        getRegisteredUsers(
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
              <PageTitle title="등록 회원 목록" />
            </Box>
          </Stack>

          <Card>
            <RegisterAttendeeListTypeTossFilters
              cSearchParams={
                cSearchParams as RegisterAttendeeListTypeTossSearchParamsType
              }
              setCSearchParamsFunc={setCSearchParamsFunc}
              deleteCSearchParams={deleteCSearchParams}
              registrationType={registrationType}
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
                onClick={() => handleExcelDownload()}
              >
                모든 회원 다운로드
              </Button>
            </Stack>
            <TableBody<getRegisteredUsersResponse>
              data={data.content}
              columns={columns as ColumnDef<getRegisteredUsersResponse>[]}
              selectable={false}
              hideHead={false}
              uniqueRowId={(row: getRegisteredUsersResponse) =>
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
