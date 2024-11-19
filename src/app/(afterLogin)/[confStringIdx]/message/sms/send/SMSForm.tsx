import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { Label } from '@/components/core/Label';
import { Filter } from './Filters';
import { SMSTemplateInfo } from './SMSTemplateInfo';
import { toast } from '@/components/core/Toaster';
import {
  getSMSLastSendedTime,
  getSenders,
  sendSMSDirectlyAddedUsers,
  sendSMSExcelUploadedUsers,
  sendSMSFilteredUsers,
  sendSMSSelectedUsers,
  sendSMSTest,
} from '@/api/messageApi';
import Swal from 'sweetalert2';
import { logger } from '@/lib/logger/defaultLogger';
import { calculateByteLength } from '@/lib/calculateByteLength';
import { DevTool } from '@hookform/devtools';
import { SEND_TYPE } from '@/constants/sendTypes';
import { DateTimePicker } from '@mui/x-date-pickers';
import { dayjs } from '@/lib/dayjs';
import { UploadImageFiles } from './UploadImageFiles';
import { DirectUser, ExcelUploadedUser } from '@/types/user';
import {
  getSendersResponse,
  sendSMSDirectlyAddedUsersRequest,
  sendSMSFilteredUsersRequest,
  sendSMSSelectedUsersRequest,
} from '@/api/types/messageTypes';
import { useRouter } from 'next/navigation';
import { PATH } from '@/paths';
import { ResponseMessageVo } from '@/api/types/responseMessageVo';
import { useQuery } from '@tanstack/react-query';

interface SMSFormData {
  subject?: string;
  memo: string;
  content: string;
  message: string;
  scheduleType?: string;
  testPhoneNumber?: string;
  senderPhoneNumber: string;
  type: string; // default value: 'custom'
  letterTemplateIdx: number | null; // 양식을 선택안했을때는 null로
}

interface SMSFormProps {
  searchParam: Filter;
  searchedUsers: number[];
  addedUsers: DirectUser[];
  excelUploadedUser: ExcelUploadedUser[];
  sendType: SEND_TYPE;
  conferenceIdx: number;
  setSearchParamError: (value: boolean) => void;
  conferenceStringIdx: string;
}

const SMSForm = ({
  searchParam,
  searchedUsers,
  addedUsers,
  excelUploadedUser,
  conferenceIdx,
  setSearchParamError,
  sendType,
  conferenceStringIdx,
}: SMSFormProps) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, touchedFields, dirtyFields },
  } = useForm<SMSFormData>({
    defaultValues: { letterTemplateIdx: null, type: 'custom' },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const router = useRouter();

  const [isSMSMode, setIsSMSMode] = useState<boolean>(true);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [messageType, setMessageType] = useState<string>('sms');
  const [scheduledDate, setScheduledDate] = useState<string | null>(null);
  const [scheduledDateErrorMessage, setScheduledDateErrorMessage] =
    useState<string>('');

  const [files, setFiles] = React.useState<File[]>([]);

  const [checkPossibleToSend, setCheckPossibleToSend] = useState<boolean>(true);

  // tsx 화살표 함수로 제네릭을 사용하면 제네릭을 jsx태그로 인식하는 이슈때문에 function키워드 사용
  function sendSMS<T>(
    fn: (data: T) => Promise<ResponseMessageVo<any>>,
    data: T
  ): void {
    setCheckPossibleToSend(false);
    fn(data)
      .then((result) => {
        if (result.status === 200) {
          handleAlert('success', result.content);
        }
      })
      .catch((error) => {
        logger.error(`<${fn} error`, error);
        handleAlert('fail');
      })
      .finally(() => {
        setCheckPossibleToSend(true);
      });
  }

  const handleAlert = (type: string, letterIdx?: number) => {
    switch (type) {
      case 'invalid':
        Swal.fire({
          title: '필수 정보 확인',
          text: '문자 전송을 위한 필수 정보를 확인 후 다시 입력해 주세요.',
        });
        return;
      case 'success':
        Swal.fire({
          title: '문자 전송 요청 완료',
          html: `<div>문자 발송을 요청했습니다.<br/>요청된 개수에 따라 문자 발송 완료까지 시간이 걸릴 수 있으며, 자세한 내용은 문자 발송 상세내역을 참조해 주세요.<br/>(닫기 선택 시, 작성중이던 페이지로 다시 돌아갑니다.)</div>`,
          showCancelButton: true,
          cancelButtonText: '닫기',
          confirmButtonText: '상세 보기',
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            router.push(
              PATH.EACH.MESSAGE.SMS.DETAIL(
                conferenceStringIdx,
                letterIdx as number
              )
            );
          }
        });
        return;
      case 'fail':
        Swal.fire({
          title: '문자 보내기 실패',
          html: `문자 발송 요청 완료되었습니다.`,
        });
        return;
    }
  };

  const onSubmit = (data: SMSFormData) => {
    if (data.scheduleType === 'y') {
      if (!scheduledDate) {
        setScheduledDateErrorMessage('예약 전송 시간을 입력해주세요');
        return;
      }
      if (scheduledDateErrorMessage !== '') {
        return;
      }
    }

    if (data.subject === '' && touchedFields.subject && dirtyFields.subject) {
      delete data['subject'];
    }

    if (sendType === SEND_TYPE.FILTER) {
      if (Object.keys(searchParam).length === 0) {
        handleAlert('invalid');
        setSearchParamError(true);
      } else {
        setSearchParamError(false);

        const formData = {
          conferenceIdx,
          searchParamJson: JSON.stringify(searchParam),
          messageType,
          ...data,
          scheduleType: data.scheduleType === 'y' ? 1 : 0,
          sendDate: data.scheduleType === 'y' ? scheduledDate : null,
          messageFileList: files,
        };
        getSMSLastSendedTime(conferenceIdx).then((result) => {
          if (result.content) {
            Swal.fire({
              title: '문자 연속 전송',
              html: result.message,
              showCancelButton: true,
              cancelButtonText: '닫기',
              confirmButtonText: '문자 전송하기',
              reverseButtons: true,
            }).then((result) => {
              if (result.isConfirmed) {
                sendSMS<sendSMSFilteredUsersRequest>(
                  sendSMSFilteredUsers,
                  formData
                );
                return;
              } else if (result.isDismissed) {
                setCheckPossibleToSend(true);
              }
            });
          } else {
            sendSMS<sendSMSFilteredUsersRequest>(
              sendSMSFilteredUsers,
              formData
            );
          }
        });
      }
    } else if (sendType === SEND_TYPE.USER) {
      if (searchedUsers.length === 0) {
        handleAlert('invalid');
        setSearchParamError(true);
      } else {
        setSearchParamError(false);
        // api

        const formData = {
          conferenceIdx,
          wuserListJson: JSON.stringify(searchedUsers),
          messageType,
          ...data,
          scheduleType: data.scheduleType === 'y' ? 1 : 0,
          sendDate: data.scheduleType === 'y' ? scheduledDate : null,
          messageFileList: files,
        };
        getSMSLastSendedTime(conferenceIdx).then((result) => {
          if (result.content) {
            Swal.fire({
              title: '문자 연속 전송',
              html: result.message,
              showCancelButton: true,
              cancelButtonText: '닫기',
              confirmButtonText: '문자 전송하기',
              reverseButtons: true,
            }).then((result) => {
              if (result.isConfirmed) {
                sendSMS<sendSMSSelectedUsersRequest>(
                  sendSMSSelectedUsers,
                  formData
                );
                return;
              } else if (result.isDismissed) {
                setCheckPossibleToSend(true);
              }
            });
          } else {
            sendSMS<sendSMSSelectedUsersRequest>(
              sendSMSSelectedUsers,
              formData
            );
          }
        });
      }
    } else if (sendType === SEND_TYPE.DIRECT) {
      if (addedUsers.length === 0) {
        handleAlert('invalid');
        setSearchParamError(true);
      } else {
        const userList = addedUsers.map((user) => {
          return {
            name: user.name === '-' ? '익명' : user.name,
            phone: user.phone.replace(/[^0-9-]/g, ''),
          };
        });
        setSearchParamError(false);
        // api

        const formData = {
          conferenceIdx,
          userListJson: JSON.stringify(userList),
          messageType,
          ...data,
          scheduleType: data.scheduleType === 'y' ? 1 : 0,
          sendDate: data.scheduleType === 'y' ? scheduledDate : null,
          messageFileList: files,
        };
        getSMSLastSendedTime(conferenceIdx).then((result) => {
          if (result.content) {
            Swal.fire({
              title: '문자 연속 전송',
              html: result.message,
              showCancelButton: true,
              cancelButtonText: '닫기',
              confirmButtonText: '문자 전송하기',
              reverseButtons: true,
            }).then((result) => {
              if (result.isConfirmed) {
                sendSMS<sendSMSDirectlyAddedUsersRequest>(
                  sendSMSDirectlyAddedUsers,
                  formData
                );
                return;
              } else if (result.isDismissed) {
                setCheckPossibleToSend(true);
              }
            });
          } else {
            sendSMS<sendSMSDirectlyAddedUsersRequest>(
              sendSMSDirectlyAddedUsers,
              formData
            );
          }
        });
      }
    } else if (sendType === SEND_TYPE.EXCEL) {
      if (excelUploadedUser.length === 0) {
        handleAlert('invalid');
        setSearchParamError(true);
      } else {
        const userList = excelUploadedUser.map((user) => {
          return {
            name: user.name === '-' ? '익명' : user.name,
            phone: user.phone,
          };
        });
        setSearchParamError(false);
        // api

        const formData = {
          conferenceIdx,
          userListJson: JSON.stringify(userList),
          messageType,
          ...data,
          scheduleType: data.scheduleType === 'y' ? 1 : 0,
          sendDate: data.scheduleType === 'y' ? scheduledDate : null,
          messageFileList: files,
        };
        const hasErrorData = excelUploadedUser.filter(
          (item) => !item.isValid
        ).length;
        if (hasErrorData) {
          Swal.fire({
            title: '주소록 오류 확인',
            html: `<div style=word-break:keep-all;>요청하신 ${excelUploadedUser.length}개 중 ${hasErrorData}건의 오류를 포함하여 전송 요청 하시겠습니까?<br/>
            오류 데이터는 문자 전송이 되지 않으므로, 삭제 후 전송요청 하시기를 권합니다.</div>`,
            showCancelButton: true,
            cancelButtonText: '닫기',
            confirmButtonText: '전송하기',
            reverseButtons: true,
          }).then((result) => {
            if (result.isConfirmed) {
              getSMSLastSendedTime(conferenceIdx).then((result) => {
                if (result.content) {
                  Swal.fire({
                    title: '문자 연속 전송',
                    html: result.message,
                    showCancelButton: true,
                    cancelButtonText: '닫기',
                    confirmButtonText: '문자 전송하기',
                    reverseButtons: true,
                  }).then((result) => {
                    if (result.isConfirmed) {
                      sendSMS<sendSMSDirectlyAddedUsersRequest>(
                        sendSMSExcelUploadedUsers,
                        formData
                      );
                      return;
                    } else if (result.isDismissed) {
                      setCheckPossibleToSend(true);
                    }
                  });
                } else {
                  sendSMS<sendSMSDirectlyAddedUsersRequest>(
                    sendSMSExcelUploadedUsers,
                    formData
                  );
                }
              });
            }
          });
        } else {
          getSMSLastSendedTime(conferenceIdx).then((result) => {
            if (result.content) {
              Swal.fire({
                title: '문자 연속 전송',
                html: result.message,
                showCancelButton: true,
                cancelButtonText: '닫기',
                confirmButtonText: '문자 전송하기',
                reverseButtons: true,
              }).then((result) => {
                if (result.isConfirmed) {
                  sendSMS<sendSMSDirectlyAddedUsersRequest>(
                    sendSMSExcelUploadedUsers,
                    formData
                  );
                  return;
                } else if (result.isDismissed) {
                  setCheckPossibleToSend(true);
                }
              });
            } else {
              sendSMS<sendSMSDirectlyAddedUsersRequest>(
                sendSMSExcelUploadedUsers,
                formData
              );
            }
          });
        }
      }
    }
  };

  const handleSendTest = () => {
    const data = watch();

    if (
      data.testPhoneNumber === undefined ||
      errors.testPhoneNumber !== undefined
    ) {
      Swal.fire({
        title: '테스트 휴대폰 번호 확인',
        text: '테스트 전송을 위한 휴대폰 번호를 확인 후 다시 입력해 주세요.',
      });
      return;
    } else if (
      data.content === undefined ||
      (errors.content !== undefined && files.length === 0)
    ) {
      Swal.fire({
        title: '필수 정보 확인',
        text: '내용 또는 파일이 있는지 확인해 주세요.',
      });
    } else {
      if (data.subject === '' && touchedFields.subject && dirtyFields.subject) {
        delete data['subject'];
      }
      const formData = {
        conferenceIdx,
        messageType,
        ...data,
        type: 'test',
        scheduleType: data.scheduleType === 'y' ? 1 : 0,
        sendDate: data.scheduleType === 'y' ? scheduledDate : null,
        messageFileList: files,
      };
      sendSMSTest(formData)
        .then((result) => {
          setTestCompleted(true);

          if (result.status === 200) {
            Swal.fire({
              title: '테스트 전송 완료',
              text: `요청하신 ${data.testPhoneNumber} 번호로 테스트 문자가 전송되었습니다.`,
            });
            setTimeout(() => {
              setTestCompleted(false);
            }, 3000);
          }
        })
        .catch((error) => {
          logger.error('<sendSMSTest> error', error);
          Swal.fire({
            title: '테스트 전송 실패',
            text: `${error.response.data.message}`,
          });
        });
    }
  };

  const { data: senders, error: sendersError } = useQuery({
    queryKey: ['getSenders'],
    queryFn: () =>
      getSenders().then((result) => {
        return result.content as getSendersResponse[];
      }),
  });

  // sms/mms
  useEffect(() => {
    const subject = watch('subject');
    const content = watch('content');

    // mms
    if (files.length !== 0 || !!subject || calculateByteLength(content) > 80) {
      if (isSMSMode) {
        setIsSMSMode(false);
        toast.info('MMS로 전환됩니다.', { duration: 1000 });
        setMessageType('mms');
        return;
      }
    } else {
      // sms
      if (!isSMSMode) {
        setIsSMSMode(true);
        toast.info('SMS로 전환됩니다.', { duration: 1000 });
        setMessageType('sms');
        return;
      }
    }
    setMessageType(isSMSMode ? 'sms' : 'mms');
  }, [isSMSMode, files, watch('subject'), watch('content')]);

  useEffect(() => {
    if (errors.memo) {
      window.scrollTo(0, 100);
    }
  }, [errors]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        px: 3,
        mt: 4,
        width: '100%',
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}
        className="w-full"
      >
        <DevTool control={control} />
        <Stack spacing={2}>
          <Controller
            control={control}
            name="memo"
            rules={{
              required: '메모를 입력해 주세요.',
              pattern: {
                value: /^.{1,50}$/,
                message: '50자 이내로 입력해 주세요.',
              },
            }}
            render={({ field }) => (
              <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                <Label label="메모*" minWidth={100} bold />
                <TextField
                  sx={{ p: 0, width: 480, mb: '18px' }}
                  error={Boolean(errors.memo)}
                  placeholder="50자 이내"
                  inputProps={{
                    maxLength: 49,
                  }}
                  InputProps={{
                    sx: {
                      height: 44,
                    },
                  }}
                  helperText={
                    errors.memo
                      ? errors.memo?.message
                      : '메모는 문자 발송 내역에 저장되는 내용이며, 문자 발송시 제목으로 표기되지 않습니다.'
                  }
                  fullWidth
                  {...field}
                />
              </Box>
            )}
          />
          <Divider />
          {/* // 추후
          <Controller
            control={control}
            name="template"
            rules={{
              required: '양식을 선택해 주세요.',
            }}
            render={({ field }) => (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Label label="양식 선택" minWidth={100}/>
                <TextField
                  sx={{ p: 0, height: 44, width: 480 }}
                  select
                  error={Boolean(errors.template)}
                  placeholder="선택"
                  helperText={errors.template?.message}
                  fullWidth
                  {...field}
                />
              </Box>
            )}
          /> */}

          <Box
            sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
          >
            <Label label="메시지 입력*" minWidth={100} bold />
            <Box>
              {isSMSMode ? (
                <Chip label="SMS" sx={{ width: 72, margin: '0 0 4px 0' }} />
              ) : (
                <Chip
                  label="MMS"
                  color="success"
                  sx={{ width: 72, margin: '0 0 4px 0' }}
                />
              )}
              <Controller
                control={control}
                name="subject"
                render={({ field }) => (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <TextField
                        label="제목"
                        sx={{ p: 0, width: 480 }}
                        InputProps={{
                          sx: {
                            height: 44,
                          },
                        }}
                        error={Boolean(errors.subject)}
                        placeholder="(선택) 제목 입력 시 MMS로 자동 전환 됩니다."
                        helperText={errors.subject?.message}
                        fullWidth
                        {...field}
                        onChange={(e) => {
                          if (calculateByteLength(e.target.value) <= 60) {
                            field.onChange(e.target.value); // 바이트가 초과하지 않으면 값 업데이트
                          }
                        }}
                      />
                      <span className="text-12 leading-14 text-stone-600 text-end pt-6">
                        {field.value?.length
                          ? calculateByteLength(field.value)
                          : 0}{' '}
                        / 60byte
                      </span>
                    </Box>
                  </Box>
                )}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', py: 1 }}>
                <span className="text-blue-main text-14">
                  *제목은 선택사항이며, 입력 시 자동으로 MMS으로 전환되어
                  발송됩니다.
                </span>
                <span className="text-blue-main text-14">
                  *MMS로 전환 시, 기본 금액이 추가됩니다.
                </span>
              </Box>
              <Controller
                control={control}
                name="content"
                rules={{
                  required:
                    files.length === 0 && '보낼 메시지를 입력해 주세요.',
                }}
                render={({ field }) => (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <TextField
                          label="내용"
                          sx={{
                            mt: 1,
                            p: 0,
                            width: 240,
                            minHeight: 200,
                            '& .MuiInputBase-root': {
                              minHeight: 200,
                            },
                          }}
                          error={Boolean(errors.content)}
                          placeholder="메시지를 입력하세요"
                          helperText={errors.content?.message}
                          fullWidth
                          multiline
                          {...field}
                          onChange={(e) => {
                            if (calculateByteLength(e.target.value) >= 4000) {
                              toast.error(
                                '최대 입력 가능한 바이트를 초과했습니다.'
                              );
                            } else {
                              field.onChange(e.target.value);
                            }
                          }}
                        />
                        <span className="text-12 leading-14 text-stone-600 text-end pt-6">
                          {field.value?.length
                            ? calculateByteLength(field.value)
                            : 0}{' '}
                          / {isSMSMode ? '80byte' : '4000byte'}
                        </span>
                      </Box>
                      <SMSTemplateInfo />
                      <Divider
                        orientation="vertical"
                        sx={{ minHeight: '254px', ml: 2 }}
                      />
                      <UploadImageFiles
                        files={files}
                        handleFiles={(newFiles: File[]) => setFiles(newFiles)}
                      />
                    </Box>
                  </Box>
                )}
              />
            </Box>
          </Box>
          <Divider />
          <Controller
            control={control}
            name="scheduleType"
            render={({ field }) => (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Label label="전송 시간" minWidth={100} bold />
                <RadioGroup
                  sx={{ height: 44 }}
                  row
                  defaultValue={'n'}
                  {...field}
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    if (field.value === 'n') {
                      setScheduledDateErrorMessage('');
                      setScheduledDate(null);
                    }
                  }}
                >
                  <FormControlLabel
                    control={<Radio />}
                    label={
                      <div>
                        <Typography
                          sx={{
                            color: 'var(--mui-palette-text-primary)',
                          }}
                          variant="inherit"
                        >
                          즉시 전송
                        </Typography>
                      </div>
                    }
                    value={'n'}
                  />
                  <FormControlLabel
                    control={<Radio />}
                    label={
                      <div>
                        <Typography
                          sx={{
                            color: 'var(--mui-palette-text-primary)',
                          }}
                          variant="inherit"
                        >
                          예약 전송
                        </Typography>
                      </div>
                    }
                    value={'y'}
                  />
                </RadioGroup>
                {field.value === 'y' && (
                  <DateTimePicker
                    sx={{ ml: 1, py: 0 }}
                    disablePast
                    ampm={false}
                    maxDateTime={dayjs().add(7, 'day')}
                    timeSteps={{ minutes: 10 }}
                    yearsOrder="desc"
                    slotProps={{
                      textField: {
                        InputProps: {
                          sx: { height: '44px' },
                        },
                        helperText: scheduledDateErrorMessage,
                        sx: {
                          ml: 1,
                          py: 0,
                          '& .MuiFormHelperText-root': {
                            color: 'var(--mui-palette-error-main)',
                          },
                        },
                      },
                    }}
                    onChange={(value) => {
                      setScheduledDate(
                        dayjs(value).format('YYYY-MM-DDTHH:mm:ss')
                      );
                    }}
                    onError={(error) => {
                      if (error) {
                        setScheduledDateErrorMessage(
                          '예약 전송 시간을 확인해주세요'
                        );
                      } else {
                        setScheduledDateErrorMessage('');
                      }
                    }}
                  />
                )}
              </Box>
            )}
          />
          <Divider />
          <Controller
            control={control}
            name="testPhoneNumber"
            rules={{
              pattern: {
                value: /^[0-9]{10,11}$/,
                message: '테스트 전 올바르게 입력해 주세요.',
              },
            }}
            render={({ field }) => (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Label label="테스트 발송" minWidth={100} bold />
                <TextField
                  sx={{ p: 0, height: 44, width: 480 }}
                  error={Boolean(errors.testPhoneNumber)}
                  placeholder="숫자 10~11자리"
                  helperText={errors.testPhoneNumber?.message}
                  fullWidth
                  {...field}
                />
                <Button
                  sx={{ px: 2, py: 1, ml: 1 }}
                  variant="contained"
                  color="secondary"
                  onClick={() => handleSendTest()}
                  disabled={testCompleted}
                >
                  테스트 전송
                </Button>
              </Box>
            )}
          />
          <Controller
            control={control}
            name="senderPhoneNumber"
            rules={{
              pattern: {
                value: /^[0-9]{10,11}$/,
                message: '발신 번호를 올바르게 입력해 주세요.',
              },
            }}
            defaultValue={senders ? senders[0]?.phoneNumber : 'error'}
            render={({ field }) => (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Label label="발신 번호*" minWidth={100} bold />
                <TextField
                  sx={{ p: 0, height: 44, width: 240 }}
                  select
                  error={Boolean(errors.senderPhoneNumber)}
                  placeholder="숫자 10~11자리"
                  helperText={errors.senderPhoneNumber?.message}
                  fullWidth
                  {...field}
                >
                  {senders
                    ? senders.map((sender) => (
                        <MenuItem
                          key={sender.contactNumberIdx}
                          value={sender.phoneNumber}
                        >
                          {sender.nickname} {sender.phoneNumber}
                        </MenuItem>
                      ))
                    : sendersError && (
                        <MenuItem value={'error'} disabled>
                          발신번호를 가져오기 실패
                        </MenuItem>
                      )}
                </TextField>
              </Box>
            )}
          />
          <Box sx={{ textAlign: 'center' }}>
            <Button
              sx={{ px: 2, py: 1, ml: 1 }}
              variant="contained"
              color="primary"
              type="submit"
              disabled={!checkPossibleToSend}
            >
              문자 전송하기
            </Button>
          </Box>
        </Stack>
      </form>
    </Box>
  );
};

export { SMSForm };
