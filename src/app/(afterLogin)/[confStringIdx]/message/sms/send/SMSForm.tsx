import React, { useState } from 'react';
import { Box, Button, Chip, Stack, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { Label } from '@/components/core/Label';
import { Filter } from './Filters';
import { SMSTemplateInfo } from './SMSTemplateInfo';
import { toast } from '@/components/core/Toaster';
import { sendSMSFilteredUsers, sendSMSTest } from '@/api/messageApi';
import Swal from 'sweetalert2';

const calculateByteLength = (text: string) => {
  // UTF-8로 인코딩된 문자열의 바이트 길이를 계산하는 함수
  return new TextEncoder().encode(text).length;
};

interface SMSFormData {
  subject: string;
  memo: string;
  content: string;
  message: string;
  testPhoneNumber?: string;
  senderPhoneNumber: string;
  messageType: string; // default value: 'custom'
  letterTemplateIdx: number | null; // 양식을 선택안했을때는 null로
}

interface SMSFormProps {
  searchParam: Filter;
  conferenceIdx: number;
}

const SMSForm = ({ searchParam, conferenceIdx }: SMSFormProps) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SMSFormData>({
    defaultValues: { letterTemplateIdx: null, messageType: 'custom' },
  });

  const [isSMSMode, setIsSMSMode] = useState<boolean>(true);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);

  const handleSMSMode = (value: string) => {
    if (isSMSMode && calculateByteLength(value) > 80) {
      setIsSMSMode(false);
      toast.info('MMS로 전환됩니다.', { duration: 1000 });
    }
    if (!isSMSMode && calculateByteLength(value) <= 80) {
      setIsSMSMode(true);
      toast.info('SMS로 전환됩니다.', { duration: 1000 });
    }
  };

  const onSubmit = (data: SMSFormData) => {
    if (Object.keys(searchParam).length === 0) {
      Swal.fire({
        title: '필수 정보 확인',
        text: '문자 전송을 위한 필수 정보를 확인 후 다시 입력해 주세요.',
      });
    } else {
      const formData = {
        searchParam,
        ...data,
      };
      sendSMSFilteredUsers(formData).then((result) => {
        if (result.status === 200) {
          Swal.fire({
            title: '문자 전송 완료',
            text: '문자 전송이 완료되었습니다.',
          });
        }
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
    } else if (
      errors.subject ||
      errors.content ||
      !data.subject ||
      !data.content
    ) {
      Swal.fire({
        title: '필수 정보 확인',
        text: '문자 전송을 위한 필수 정보를 확인 후 다시 입력해 주세요.',
      });
    } else {
      const formData = {
        conferenceIdx,
        ...data,
      };
      sendSMSTest(formData).then((result) => {
        if (result.status === 200) {
          Swal.fire({
            title: '문자 전송 완료',
            text: '문자 전송이 완료되었습니다.',
          });
          setTestCompleted(true);
        }
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', px: 3, mt: 2 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Controller
            control={control}
            name="subject"
            rules={{
              required: '발송 제목을 입력해 주세요.',
              pattern: {
                value: /^[a-zA-Zㄱ-ㅎ가-힣0-9.!]{2,25}$/,
                message: '발송 제목을 올바르게 입력해 주세요.',
              },
            }}
            render={({ field }) => (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Label label="제목*" minWidth={100} />
                <TextField
                  sx={{ p: 0, height: 44, width: 480 }}
                  error={Boolean(errors.subject)}
                  placeholder="25자 이내"
                  helperText={
                    errors.subject
                      ? errors.subject?.message
                      : '제목은 문자 발송 내역에 저장되는 내용이며, 문자 발송시 제목으로 표기되지 않습니다.'
                  }
                  fullWidth
                  {...field}
                />
              </Box>
            )}
          />
          <Controller
            control={control}
            name="memo"
            rules={{
              required: '메모를 입력해 주세요.',
              pattern: {
                value: /^[a-zA-Zㄱ-ㅎ가-힣0-9.!]{1,50}$/,
                message: '50자 이내로 입력해 주세요.',
              },
            }}
            render={({ field }) => (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Label label="메모" minWidth={100} />
                <TextField
                  sx={{ p: 0, height: 44, width: 480 }}
                  error={Boolean(errors.memo)}
                  placeholder="50자 이내"
                  helperText={errors.memo?.message}
                  fullWidth
                  {...field}
                />
              </Box>
            )}
          />
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
          <Controller
            control={control}
            name="content"
            rules={{
              required: '메시지를 입력하세요.',
            }}
            render={({ field }) => {
              const chips = isSMSMode ? (
                <Chip label="SMS" sx={{ width: 72 }} />
              ) : (
                <Chip label="MMS" color="success" sx={{ width: 72 }} />
              );
              return (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Label label="메시지 입력*" minWidth={100} />
                  <Box sx={{ display: 'flex' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {chips}
                      <TextField
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
                      <span className="text-12 leading-14 text-stone-600 text-end">
                        {field.value?.length
                          ? calculateByteLength(field.value)
                          : 0}
                        / {isSMSMode ? '80byte' : '4000byte'}
                      </span>
                    </Box>
                    <SMSTemplateInfo />
                  </Box>
                </Box>
              );
            }}
          />
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
            defaultValue="01062813889"
            render={({ field }) => (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Label label="발신 번호*" minWidth={100} />
                <TextField
                  sx={{ p: 0, height: 44, width: 480 }}
                  error={Boolean(errors.senderPhoneNumber)}
                  placeholder="숫자 10~11자리"
                  helperText={errors.senderPhoneNumber?.message}
                  fullWidth
                  {...field}
                />
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
