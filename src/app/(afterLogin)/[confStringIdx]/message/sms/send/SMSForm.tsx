import React, { useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { Label } from '@/components/core/Label';
import { Filter } from './Filters';
import { SMSTemplateInfo } from './SMSTemplateInfo';
import { toast } from '@/components/core/Toaster';
import { sendSMSFilteredUsers, sendSMSTest } from '@/api/messageApi';
import Swal from 'sweetalert2';
import { logger } from '@/lib/logger/defaultLogger';
import { calculateByteLength } from '@/lib/calculateByteLength';
import { DevTool } from '@hookform/devtools';

interface SMSFormData {
  subject?: string;
  memo: string;
  content: string;
  message: string;
  testPhoneNumber?: string;
  senderPhoneNumber: string;
  type: string; // default value: 'custom'
  letterTemplateIdx: number | null; // 양식을 선택안했을때는 null로
}

interface SMSFormProps {
  searchParam: Filter;
  conferenceIdx: number;
  setSearchParamError: (value: boolean) => void;
}

const dummySender = [
  { label: '학회관리자 1', value: '01035793889' },
  { label: '학회관리자 2', value: '01062813889' },
];

const SMSForm = ({
  searchParam,
  conferenceIdx,
  setSearchParamError,
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

  const [isSMSMode, setIsSMSMode] = useState<boolean>(true);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);

  const handleSMSMode = (value: string) => {
    if (!watch('subject')) {
      if (isSMSMode && calculateByteLength(value) > 80) {
        setIsSMSMode(false);
        toast.info('MMS로 전환됩니다.', { duration: 1000 });
      }
      if (!isSMSMode && calculateByteLength(value) <= 80) {
        setIsSMSMode(true);
        toast.info('SMS로 전환됩니다.', { duration: 1000 });
      }
    }
  };

  const onSubmit = (data: SMSFormData) => {
    if (Object.keys(searchParam).length === 0) {
      Swal.fire({
        title: '필수 정보 확인',
        text: '문자 전송을 위한 필수 정보를 확인 후 다시 입력해 주세요.',
      });
      setSearchParamError(true);
    } else {
      setSearchParamError(false);
      const messageType = isSMSMode ? 'sms' : 'mms';

      if (touchedFields.subject && dirtyFields.subject) {
        delete data['subject'];
      }

      const formData = {
        searchParam,
        messageType,
        ...data,
      };
      sendSMSFilteredUsers(formData)
        .then((result) => {
          if (result.status === 200) {
            Swal.fire({
              title: '문자 전송 완료',
              text: '문자 전송이 완료되었습니다.',
            });
          }
        })
        .catch((error) => {
          logger.error('<sendSMSFilteredUsers> error', error);
          Swal.fire({
            title: '문자 전송 실패',
            text: `${error.response.data.message}`,
          });
        });
    }
  };

  const handleSendTest = () => {
    const data = watch();

    if (errors.testPhoneNumber) {
      Swal.fire({
        title: '테스트 휴대폰 번호 확인',
        text: '테스트 전송을 위한 휴대폰 번호를 확인 후 다시 입력해 주세요.',
      });
      return;
    } else if (errors.content || !data.content) {
      Swal.fire({
        title: '필수 정보 확인',
        text: '문자 전송을 위한 필수 정보를 확인 후 다시 입력해 주세요.',
      });
    } else {
      if (touchedFields.subject && dirtyFields.subject) {
        delete data['subject'];
      }
      const formData = {
        conferenceIdx,
        ...data,
        type: 'test',
      };
      sendSMSTest(formData)
        .then((result) => {
          if (result.status === 200) {
            Swal.fire({
              title: '테스트 전송 완료',
              text: `요청하신 ${data.testPhoneNumber} 번호로 테스트 문자가 전송되었습니다.`,
            });
            setTestCompleted(true);
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
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
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
                <Label label="메모*" minWidth={100} />
                <TextField
                  sx={{ p: 0, width: 480, mb: '18px' }}
                  error={Boolean(errors.memo)}
                  placeholder="50자 이내"
                  helperText={
                    errors.memo
                      ? errors.memo?.message
                      : '제목은 문자 발송 내역에 저장되는 내용이며, 문자 발송시 제목으로 표기되지 않습니다.'
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
            <Label label="메시지 입력*" minWidth={100} />
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
                rules={{
                  pattern: {
                    value: /^.{2,25}$/,
                    message: '발송 제목을 올바르게 입력해 주세요.',
                  },
                }}
                render={({ field }) => (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <TextField
                        label="제목"
                        sx={{ p: 0, width: 480 }}
                        error={Boolean(errors.subject)}
                        placeholder="(선택) 제목 입력 시 MMS로 자동 전환 됩니다."
                        helperText={errors.subject?.message}
                        fullWidth
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setIsSMSMode(e.target.value.length === 0);
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
                  required: '보낼 메시지를 입력해 주세요.',
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
                              handleSMSMode(field.value);
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
                    </Box>
                  </Box>
                )}
              />
            </Box>
          </Box>
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
            disabled={testCompleted}
            render={({ field }) => (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Label label="테스트 발송" minWidth={100} />
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
            defaultValue={dummySender[0].value}
            render={({ field }) => (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Label label="발신 번호*" minWidth={100} />
                <TextField
                  sx={{ p: 0, height: 44, width: 240 }}
                  select
                  error={Boolean(errors.senderPhoneNumber)}
                  placeholder="숫자 10~11자리"
                  helperText={errors.senderPhoneNumber?.message}
                  fullWidth
                  {...field}
                >
                  {dummySender.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label} {option.value}
                    </MenuItem>
                  ))}
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
