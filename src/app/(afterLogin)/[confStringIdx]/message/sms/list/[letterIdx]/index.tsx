'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { PageTitle } from '@/components/core/PageTitle';
import { TASK_STATUS, getSMSDetailResponse } from '@/api/types/messageTypes';
import { Label } from '@/components/core/Label';
import { numberWithComma } from '@/lib/numberWithComma';
import {
  downloadSendedUsers,
  getSMSDetail,
  // resendFailedUser,
  stopSendingMessage,
} from '@/api/messageApi';
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
import { Loading, PageLoading } from '@/components/core/Loading';
import { SMSDetailList } from './SMSDetailList';
import { bytesToKB } from '@/lib/byteToKB';
import { DownloadIcon } from '@/components/icons/DownloadIcon';
import { ResetIcon } from '@/components/icons/ResetIcon';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { InitSearchParam } from '@/lib/InitSearchParams';

interface SMSSendDetailProps {
  letterIdx: string;
}

const SMSSendDetail = ({ letterIdx }: SMSSendDetailProps) => {
  const conferenceIdx = useSelector(selectConferenceIdx);

  const initSearchParam = InitSearchParam(
    conferenceIdx as number,
    'tbl_letter_item.letter_item_idx'
  );

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

  const { error, data, refetch, isLoading } = useQuery({
    queryKey: ['getSMSDetail', letterIdx, cSearchParams],
    queryFn: () =>
      getSMSDetail({ ...cSearchParams, letterIdx })
        .then((result) => {
          return result.content as getSMSDetailResponse;
        })
        .finally(() => {
          setIsPending(false);
        }),
  });

  // 재발송
  // const handleAllFailedResend = () => {
  //   Swal.fire({
  //     title: '실패 문자 재발송',
  //     text: `문자 발송 실패한 ${data?.failureCount}명에게 문자 내용을 재발송 하시겠습니까?`,
  //     confirmButtonText: '발송',
  //     showCancelButton: true,
  //     cancelButtonText: '취소',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       setIsPending(true);
  //       resendFailedUser({
  //         conferenceIdx: conferenceIdx as number,
  //         letterIdx: data?.letterIdx as number,
  //         type: 'failedTotal',
  //       })
  //         .then((result) => {
  //           return result;
  //         })
  //         .catch((error) => {
  //           logger.error(error);
  //         })
  //         .finally(() => {
  //           setIsPending(false);
  //         });
  //     }
  //   });
  // };

  // 재발송
  // const handleSelectedFailedResend = () => {
  //   Swal.fire({
  //     title: '선택 문자 재발송',
  //     text: `선택된 ${selectedUser.length}명에게 문자 내용을 재발송 하시겠습니까?`,
  //     confirmButtonText: '발송',
  //     showCancelButton: true,
  //     cancelButtonText: '취소',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       setIsPending(true);
  //       resendFailedUser({
  //         conferenceIdx: conferenceIdx as number,
  //         letterIdx: data?.letterIdx as number,
  //         type: 'selected',
  //         letterItemIdxListJson: JSON.stringify(selectedUser),
  //       })
  //         .then((result) => {
  //           return result;
  //         })
  //         .catch((error) => {
  //           logger.error(error);
  //         })
  //         .finally(() => {
  //           setIsPending(false);
  //         });
  //     }
  //   });
  // };

  const handleExcelDownload = () => {
    downloadSendedUsers(letterIdx, data?.completeDate as string);
  };

  const handleStopSend = () => {
    Swal.fire({
      title: '문자 발송 취소',
      html: `<div style=text-align:left;margin:auto;width:400px;>
    <div style=word-break:keep-all;>
      전송중이던 문자 중 아직 발송되지 않은 문자의 발송을 취소합니다.
    </div>
    <ul style=list-style:disc;list-style-position:inside;padding-left:8px;padding-top:10px;>
      <li>이미 발송된 문자는 취소할 수 없습니다.</li>
      <li>문자 발송 내역을 참조해 주세요.</li>
    </ul>
  </div>`,
      confirmButtonText: '발송 취소하기',
      showCancelButton: true,
      cancelButtonText: '닫기',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setIsPending(true);
        stopSendingMessage(letterIdx)
          .then((result) => {
            return result;
          })
          .catch((error) => {
            Swal.fire({
              title: '문자 발송 중지 실패',
              html: '문자 발송 중지를 실패했습니다.<br/>관리자에게 문의해주세요.',
            });
            logger.error(error);
          })
          .finally(() => {
            setIsPending(false);
            refetch();
          });
      }
    });
  };

  if (error) {
    logger.error(error);
    return <div>Error: {error.message}</div>;
  }

  if (isLoading) {
    return <PageLoading />;
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
      {data ? (
        <>
          <div>
            {/* TODO breadcrumbs */}
            <PageTitle title={`문자 발송 내역 상세 (id:${letterIdx})`} />
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
                    {data.filterJson ? (
                      handleFilterChips(data.filterJson)
                    ) : (
                      <span className="text-14">{data.receiverInfo}</span>
                    )}
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
                      {data.failureCount
                        ? numberWithComma(data.failureCount)
                        : '-'}
                    </span>
                  </Box>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', flex: 1, alignItems: 'center' }}>
                  <Label label="발송 요청 일시" minWidth={100} bold />
                  <Box>
                    <div className="flex">
                      {data.scheduleType === 1 && (
                        <span className="mr-4">
                          <Chip label="예약" color={CHIP_COLOR.neutral} />
                        </span>
                      )}
                      <span className="text-14">{data.sendDate}</span>
                    </div>
                    {data.scheduleType === 1 && (
                      <div className="text-12 text-gray-800 leading-20 pl-8 pt-4">
                        *예약발송이 시작되면 취소 불가
                      </div>
                    )}
                  </Box>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', flex: 1 }}>
                  <Label label="발송 완료 일시" minWidth={100} bold />
                  <span className="text-14">
                    {data.completeDate
                      ? data.completeDate
                      : data.taskStatus ===
                          (TASK_STATUS.apiInProgress ||
                            TASK_STATUS.inComplete ||
                            TASK_STATUS.inProgress)
                        ? '발송중'
                        : '-'}
                  </span>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Label label="발신자" minWidth={100} bold />
                  <span className="text-14">{data.senderName}</span>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Label label="발신번호" minWidth={100} bold />
                  <span className="text-14">{data.senderPhoneNumber}</span>
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
                      <div className="mb-8">
                        <Chip
                          label={data.messageType.toUpperCase()}
                          color={
                            data.messageType === 'sms'
                              ? CHIP_COLOR.secondary
                              : CHIP_COLOR.success
                          }
                        />
                      </div>
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
                    {data.letterFileList.length !== 0 && (
                      <>
                        <Label label="이미지 첨부" minWidth={100} />
                        <div className="text-11 text-gray-800 my-4">
                          <span>
                            총 {data.letterFileList.length}개의 파일{' '}
                            {bytesToKB(
                              data.letterFileList.reduce(
                                (acc, curr) => acc + curr.fileSize,
                                0
                              )
                            )}
                            KB
                          </span>
                          <br />
                          <span>(30일 이내에만 재 다운로드가 가능합니다.)</span>
                        </div>
                        <Divider sx={{ my: '8px' }} />
                        {data.letterFileList.map((file) => (
                          <>
                            <div
                              key={file.fileOriginName}
                              className="flex justify-between px-8 items-center"
                            >
                              <div className="flex gap-8">
                                <div className="w-50 h-50">
                                  <Image
                                    src={file.fileTotalPath}
                                    width={50}
                                    height={50}
                                    style={{ maxHeight: '100%' }}
                                    alt={`thumbnail-${file.fileOriginName}`}
                                  />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-14">
                                    {file.fileOriginName}
                                  </span>
                                  <span className="text-12 text-gray-700">
                                    {bytesToKB(file.fileSize)}KB
                                  </span>
                                </div>
                              </div>
                              <IconButton
                                onClick={() => {
                                  window.location.href = file.fileTotalPath;
                                }}
                                sx={{
                                  padding: '4px',
                                  width: 24,
                                  height: 24,
                                  borderRadius: 24,
                                }}
                                disabled={file.fileStatus === 'delete'}
                              >
                                <DownloadIcon
                                  size={16}
                                  fill={
                                    file.fileStatus === 'delete'
                                      ? '#C4C7CB'
                                      : '#6C737F'
                                  }
                                />
                              </IconButton>
                            </div>
                            <Divider sx={{ my: '8px' }} />
                          </>
                        ))}
                      </>
                    )}
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
                {data.taskStatus === 'api_complete' ? (
                  <>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleExcelDownload()}
                      startIcon={<DownloadIcon fill="white" />}
                      // disabled={data.failureCount === 0}
                    >
                      엑셀 다운로드
                    </Button>
                    {/* 
                    다음 스프린트로 기능 이전
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleAllFailedResend()}
                      disabled={data.failureCount === 0}
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
                    </Button> */}
                  </>
                ) : data.taskStatus === 'interior_in_progress' ? (
                  <>
                    {data.cancelDate ? null : (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleStopSend()}
                        startIcon={<XIcon />}
                      >
                        즉시 발송 취소
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<ResetIcon className="fill-white" />}
                      onClick={() => {
                        setIsPending(true);
                        refetch();
                      }}
                    >
                      새로고침
                      {selectedUser.length !== 0 && `(${selectedUser.length})`}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ResetIcon className="fill-white" />}
                    onClick={() => {
                      setIsPending(true);
                      refetch();
                    }}
                  >
                    새로고침
                    {selectedUser.length !== 0 && `(${selectedUser.length})`}
                  </Button>
                )}
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
