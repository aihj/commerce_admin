'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Button, Card, Divider, Stack, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import { PageTitle } from '@/components/core/PageTitle';
import { getSMSDetailResponse } from '@/api/types/messageTypes';
import { Label } from '@/components/core/Label';
import { numberWithComma } from '@/lib/numberWithComma';
import { getSMSDetail, resendFailedUser } from '@/api/messageApi';
import { selectConferenceIdx } from '@/redux/slices/pcoSlice';
import { TableSearchParams } from '@/api/types/tableSearchParams';
import useCustomSearchParams from '@/hooks/useCustomSearchParams';
import { logger } from '@/lib/logger/defaultLogger';
import { calculateByteLength } from '@/lib/calculateByteLength';
import { CHIP_COLOR, Chip } from '@/components/core/Chip';
import {
  GENDERS,
  PAYMENT_STATUS,
  REGISTRATION_STATUS,
  WUSER_STATUS,
} from '@/constants/filterSelectOptions';
import { Loading } from '@/components/core/Loading';
import { SMSDetailList } from './SMSDetailList';

interface SMSSendDetailProps {
  letterIdx: string;
}

const SMSSendDetail = ({ letterIdx }: SMSSendDetailProps) => {
  const conferenceIdx = useSelector(selectConferenceIdx);
  // TODO 공통으로 빼기
  const initSearchParam = useMemo((): TableSearchParams => {
    return {
      conferenceIdx: conferenceIdx as number,
      currentPage: 0,
      rowsPerPage: 10,

      sortType: 'tbl_letter_item.letter_item_idx',
      sortDir: 'desc',
    };
  }, [conferenceIdx]);
  const { cSearchParams, setCSearchParamsFunc } =
    useCustomSearchParams<TableSearchParams>(initSearchParam);

  const [isPending, setIsPending] = useState<boolean>(false);

  const handleFilterChips = (filterString: string) => {
    const filterJson = JSON.parse(filterString);
    const { conferenceIdx, ...filters } = filterJson;
    logger.debug(conferenceIdx);
    const chips = [];
    if (Object.keys(filters).length === 0) {
      chips.push(
        <Chip
          key="birthFullYear"
          label="전체 회원"
          type="soft"
          color={CHIP_COLOR.secondary}
        />
      );
      return chips;
    } else {
      if (filters.birthDateStartT && filters.birthDateEndT) {
        chips.push(
          <Chip
            key="birthFullYear"
            label={`${filters.birthDateStartT}년생 ~ ${filters.birthDateEndT}년생`}
            type="soft"
            color={CHIP_COLOR.secondary}
          />
        );
      } else if (filters.birthDateStartT) {
        chips.push(
          <Chip
            key="birthDateStartT"
            label={`${filters.birthDateStartT}년생~`}
            type="soft"
            color={CHIP_COLOR.secondary}
          />
        );
      } else if (filters.birthDateEndT) {
        chips.push(
          <Chip
            key="birthDateEndT"
            label={`~${filters.birthDateEndT}년생`}
            type="soft"
            color={CHIP_COLOR.secondary}
          />
        );
      }

      if (filters.gender) {
        chips.push(
          <Chip
            key="gender"
            label={`${GENDERS.filter((item) => item.value === filters.gender)[0].label}`}
            type="soft"
            color={CHIP_COLOR.secondary}
          />
        );
      }
      if (filters.wuserStatus) {
        chips.push(
          <Chip
            key="wuserStatus"
            label={`${WUSER_STATUS.filter((item) => item.value === filters.wuserStatus)[0].label}`}
            type="soft"
            color={CHIP_COLOR.secondary}
          />
        );
      }
      if (filters.registrationStatus) {
        chips.push(
          <Chip
            key="registrationStatus"
            label={`${REGISTRATION_STATUS.filter((item) => item.value === filters.registrationStatus)[0].label}`}
            type="soft"
            color={CHIP_COLOR.secondary}
          />
        );
      }
      if (filters.paymentStatus) {
        chips.push(
          <Chip
            key="paymentStatus"
            label={`${PAYMENT_STATUS.filter((item) => item.value === filters.paymentStatus)[0].label}`}
            type="soft"
            color={CHIP_COLOR.secondary}
          />
        );
      }
      return chips;
    }
  };

  const [selectedUser, setSelectedUser] = useState<number[]>([]);

  const { error, data } = useQuery({
    queryKey: ['getSMSDetail', letterIdx],
    queryFn: () =>
      getSMSDetail({ ...cSearchParams, letterIdx }).then((result) => {
        return result.content as getSMSDetailResponse;
      }),
  });

  const handleAllFailedResend = () => {
    Swal.fire({
      title: '실패 문자 재발송',
      text: `문자 발송 실패한 ${data?.failureCount}명에게 문자 내용을 재발송 하시겠습니까?`,
      confirmButtonText: '발송',
      showCancelButton: true,
      cancelButtonText: '취소',
    }).then((result) => {
      if (result.isConfirmed) {
        setIsPending(true);
        resendFailedUser({
          conferenceIdx: conferenceIdx as number,
          letterIdx: data?.letterIdx as number,
          type: 'failedTotal',
        })
          .then((result) => {
            return result;
          })
          .catch((error) => {
            logger.error(error);
          })
          .finally(() => {
            setIsPending(false);
          });
      }
    });
  };

  const handleSelectedFailedResend = () => {
    Swal.fire({
      title: '선택 문자 재발송',
      text: `선택된 ${selectedUser.length}명에게 문자 내용을 재발송 하시겠습니까?`,
      confirmButtonText: '발송',
      showCancelButton: true,
      cancelButtonText: '취소',
    }).then((result) => {
      if (result.isConfirmed) {
        setIsPending(true);
        resendFailedUser({
          conferenceIdx: conferenceIdx as number,
          letterIdx: data?.letterIdx as number,
          type: 'selected',
          letterItemIdxListJson: JSON.stringify(selectedUser),
        })
          .then((result) => {
            return result;
          })
          .catch((error) => {
            logger.error(error);
          })
          .finally(() => {
            setIsPending(false);
          });
      }
    });
  };

  if (error) {
    logger.error(error);
    return <div>Error</div>;
  }

  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      <Loading open={isPending} />
      {data?.content ? (
        <>
          <div>
            {/* TODO breadcrumbs */}
            <PageTitle title={`문자 발송 내역 상세 (${letterIdx})`} />
          </div>
          <Stack spacing={2} direction="row" sx={{ flex: 1, mt: 4 }}>
            <Card
              sx={{
                flex: 2,
                p: 2,
                '&.MuiPaper-root': {
                  boxShadow: 'none',
                },
              }}
            >
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Label label="전송 대상" minWidth={100} bold />
                  <Stack
                    direction="row"
                    useFlexGap
                    sx={{ flexWrap: 'wrap' }}
                    gap={1}
                  >
                    {data.filterJson && handleFilterChips(data.filterJson)}
                  </Stack>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', flex: 1 }}>
                  <Box
                    sx={{ display: 'flex', alignItems: 'baseline', flex: 1 }}
                  >
                    <Label label="요청 건수" minWidth={100} bold />
                    <span className="text-14">
                      {numberWithComma(data.count)}
                    </span>
                  </Box>
                  <Box
                    sx={{ display: 'flex', alignItems: 'baseline', flex: 1 }}
                  >
                    <Label label="실패 건수" minWidth={100} bold />
                    <span className="text-14">
                      {numberWithComma(data.failureCount)}
                    </span>
                  </Box>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', flex: 1 }}>
                  <Label label="발송 요청 일시" minWidth={100} bold />
                  <span className="text-14">{data.sendDate}</span>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', flex: 1 }}>
                  <Label label="발송 완료 일시" minWidth={100} bold />
                  <span className="text-14">{data.completeDate}</span>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Label label="메모" minWidth={100} bold />
                  <span className="text-14">{data.memo}</span>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Label label="양식" minWidth={100} bold />
                  {/* TODO 양식 select */}
                  <span className="text-14">선택 안함</span>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Label label="메시지" minWidth={100} bold />
                  {/* TODO 양식 select */}
                  <Box sx={{ width: '100%' }}>
                    {data.messageType ? (
                      <Chip
                        label={data.messageType.toUpperCase()}
                        color={
                          data.messageType === 'sms'
                            ? CHIP_COLOR.secondary
                            : CHIP_COLOR.success
                        }
                      />
                    ) : null}
                    <Label label="제목" minWidth={100} />
                    <TextField
                      sx={{ p: 0, height: 44, width: '100%' }}
                      value={data.subject ? data.subject : '제목 없음'}
                      fullWidth
                      disabled
                      // {...field}
                    />
                    <div className="text-end pt-6 pb-16">
                      <span className="text-12 leading-14 text-stone-600">
                        {data.subject?.length
                          ? calculateByteLength(data.subject)
                          : 0}{' '}
                        / 60byte
                      </span>
                    </div>
                    <Label label="내용" minWidth={100} />
                    <TextField
                      sx={{
                        p: 0,
                        minHeight: 200,
                        '& .MuiInputBase-root': {
                          minHeight: 200,
                        },
                        width: '100%',
                      }}
                      value={data.content}
                      fullWidth
                      multiline
                      disabled
                      // {...field}
                    />
                    {/* TODO sms type */}
                    <div className="text-end pt-6 pb-16">
                      <span className="text-12 leading-14 text-stone-600">
                        {data.content?.length
                          ? calculateByteLength(data.content)
                          : 0}{' '}
                        / {data.messageType === 'sms' ? '80byte' : '4000byte'}
                      </span>
                    </div>
                  </Box>
                </Box>
              </Stack>
            </Card>
            <Divider />
            <Card sx={{ flex: 3 }}>
              <Stack
                spacing={2}
                direction="row"
                sx={{ m: 2, justifyContent: 'flex-end' }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleAllFailedResend()}
                >
                  실패 일괄 재발송
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleSelectedFailedResend()}
                >
                  선택 재발송
                  {selectedUser.length !== 0 && `(${selectedUser.length})`}
                </Button>
              </Stack>
              <SMSDetailList
                data={data.letterItemList}
                cSearchParams={cSearchParams as TableSearchParams}
                setCSearchParamsFunc={setCSearchParamsFunc}
                totalCount={data.count}
                handleSelectedUser={(selectedUser: number[]) =>
                  setSelectedUser(selectedUser)
                }
              />
            </Card>
          </Stack>
        </>
      ) : null}
    </Box>
  );
};

export { SMSSendDetail };
