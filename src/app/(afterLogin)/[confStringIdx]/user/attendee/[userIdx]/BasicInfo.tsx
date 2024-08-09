'use client';

import React, { forwardRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { DevTool } from '@hookform/devtools';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { Label } from '@/components/core/Label';
import { GENDERS, WUSER_STATUS } from '@/constants/selectOptions';
import { JoinAttendeeDtVo } from '@/api/types/attendeeTypes';
import { dateFormat } from '@/lib/dayjs';
import { UserDuplicatedInfoRequest } from '@/api/types/publicTypes';

export interface BasicInfoForm {
  wuserIdx: number;
  name: string;
  birthDate: string;
  gender: string;
  wuserStatus: string;
  signUpDate: string;
  phone: string;
  email: string;
  memo?: string;
}

interface BasicInfoProp {
  basicInfo: JoinAttendeeDtVo | undefined;
  userIdx: number;
  conferenceIdx: number;
  handleBasicInfo: (data: BasicInfoForm) => void;
  handleDuplicatedEmail: (data: UserDuplicatedInfoRequest) => void;
  handleDuplicatedPhone: (data: UserDuplicatedInfoRequest) => void;
  checkedEmail: boolean;
  checkedPhone: boolean;
}

const BasicInfo = forwardRef(
  (
    {
      basicInfo,
      userIdx,
      conferenceIdx,
      handleBasicInfo,
      handleDuplicatedEmail,
      handleDuplicatedPhone,
      checkedEmail,
      checkedPhone,
    }: BasicInfoProp,
    ref
  ) => {
    const {
      control,
      handleSubmit,
      watch,
      formState: { errors, dirtyFields },
      trigger,
    } = useForm<BasicInfoForm>({ defaultValues: { wuserIdx: userIdx } });

    /**
     * 중복 확인 api 응답과 별개로
     * 값을 수정 후 중복확인 api를 호출했는지,
     * 수정 한 값이 기존 값과 동일한지를 확인하기 위한 state
     */
    const [validEmail, setValidEmail] = useState<boolean>(true);
    const [validPhone, setValidPhone] = useState<boolean>(true);

    const onsubmit = (data: BasicInfoForm) => {
      if (basicInfo?.phone !== data.phone) {
        // 수정된 값이 중복체크 api를 통과하지 못했거나, 중복체크 api를 호출하지 않았을때
        if (!checkedPhone || !validPhone) {
          Swal.fire({
            title: '휴대폰 번호 확인',
            text: '휴대폰 번호 중복 체크 후 저장해 주세요.',
          });
          return;
        } else {
          handleBasicInfo(data);
        }
      } else if (basicInfo.email !== data.email) {
        if (!checkedEmail || !validEmail) {
          Swal.fire({
            title: '이메일 확인',
            text: '이메일 중복 체크 후 저장해 주세요.',
          });
          return;
        } else {
          handleBasicInfo(data);
        }
      } else {
        handleBasicInfo(data);
      }
    };

    const handleCheckEmail = () => {
      trigger('email').then((result) => {
        if (result) {
          const data = watch();
          handleDuplicatedEmail({ conferenceIdx, email: data.email });
        }
      });
    };

    const handleCheckPhone = () => {
      trigger('phone').then((result) => {
        if (result) {
          const data = watch();
          handleDuplicatedPhone({
            conferenceIdx,
            phone: data.phone,
            wserviceName: process.env.NEXT_PUBLIC_AUTH_TYPE,
          });
        }
      });
    };

    const handleValidEmail = (value: string) => {
      setValidEmail(false);
      if (value === basicInfo?.email) {
        setValidEmail(true);
      }
    };

    const handleValidPhone = (value: string) => {
      setValidPhone(false);
      if (value === basicInfo?.phone) {
        setValidPhone(true);
      }
    };

    return (
      <Card
        sx={{
          borderRadius: '10px',
          boxShadow: 'none',
          border: `1px solid var(--color-secondary-light)`,
        }}
      >
        <CardHeader
          ref={ref}
          titleTypographyProps={{
            color: 'var(--color-secondary-darkest)',
            fontWeight: 700,
            fontSize: '18px',
          }}
          className="bg-secondary-light"
          title="일반 정보"
        />
        <form onSubmit={handleSubmit(onsubmit)}>
          <CardContent className="flex flex-col gap-24" sx={{ p: 3 }}>
            <DevTool control={control} /> {/* set up the dev tool */}
            <div className="flex">
              <Label label="기본 정보" />
              <Stack spacing={2} direction="row" sx={{ width: '100%' }}>
                <Controller
                  control={control}
                  name="name"
                  rules={{
                    required: '이름을 입력해 주세요.',
                    pattern: {
                      value: /^[가-힣a-zA-Z\s]{2,}$/,
                      message: '이름을 올바르게 입력해 주세요.',
                    },
                  }}
                  defaultValue={basicInfo?.name}
                  render={({ field }) => (
                    <TextField
                      label="이름"
                      sx={{ p: 0 }}
                      error={Boolean(errors.name)}
                      helperText={errors.name?.message}
                      fullWidth
                      {...field}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="birthDate"
                  defaultValue={dateFormat(basicInfo?.birthDate as string)}
                  render={({ field }) => (
                    <TextField
                      label="생년월일"
                      disabled
                      sx={{ p: 0 }}
                      fullWidth
                      {...field}
                    />
                    // <DatePicker
                    //   {...field}
                    //   format="MMM D, YYYY"
                    //   onChange={(date) => {
                    //     field.onChange(date?.toDate());
                    //   }}
                    //   slotProps={{
                    //     textField: {
                    //       label: '생년월일',
                    //       error: Boolean(errors.birthDate),
                    //       fullWidth: true,
                    //       helperText: errors.birthDate?.message,
                    //       sx: { p: 0 },
                    //     },
                    //   }}
                    //   value={dayjs(basicInfo?.birthDate)}
                    // />
                  )}
                />
                <Controller
                  control={control}
                  name="gender"
                  defaultValue={basicInfo?.gender}
                  render={({ field }) => (
                    <TextField
                      label="성별"
                      select
                      fullWidth
                      disabled
                      sx={{ p: 0 }}
                      {...field}
                    >
                      {GENDERS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Stack>
            </div>
            <div className="flex">
              <Label label="회원 가입 정보" />
              <Stack spacing={2} direction="row" sx={{ width: '100%' }}>
                <Controller
                  control={control}
                  name="wuserStatus"
                  defaultValue={basicInfo?.wuserStatus}
                  render={({ field }) => (
                    <TextField
                      label="회원 상태"
                      select
                      fullWidth
                      sx={{ p: 0 }}
                      {...field}
                    >
                      {WUSER_STATUS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
                <Controller
                  control={control}
                  name="signUpDate"
                  defaultValue={basicInfo?.wuserCreateT}
                  render={({ field }) => (
                    <TextField
                      label="가입 날짜"
                      disabled
                      sx={{ p: 0 }}
                      fullWidth
                      {...field}
                    />
                  )}
                />
              </Stack>
            </div>
            <div className="flex">
              <Label label="휴대폰 번호" />
              <Stack spacing={2} direction="row">
                <Controller
                  control={control}
                  name="phone"
                  rules={{
                    required: '휴대폰 번호를 입력해 주세요.',
                    pattern: {
                      value: /^010\d{8}$/,
                      message: '휴대폰 번호를 올바르게 입력해 주세요.',
                    },
                  }}
                  defaultValue={basicInfo?.phone}
                  render={({ field }) => (
                    <TextField
                      sx={{ p: 0, width: 340 }}
                      error={Boolean(errors.phone)}
                      helperText={errors.phone?.message}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handleValidPhone(e.target.value);
                      }}
                    />
                  )}
                />
                <Button
                  sx={{ minWidth: 120, maxHeight: 49 }}
                  color="secondary"
                  onClick={() => handleCheckPhone()}
                  variant="contained"
                  size="large"
                  disabled={!dirtyFields.phone || validPhone}
                >
                  중복확인
                </Button>
              </Stack>
            </div>
            <div className="flex">
              <Label label="이메일 주소" />
              <Stack spacing={2} direction="row">
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: '이메일을 입력해 주세요.',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
                      message: '이메일을 올바르게 입력해 주세요.',
                    },
                  }}
                  defaultValue={basicInfo?.email}
                  render={({ field }) => (
                    <TextField
                      sx={{ p: 0, width: 340 }}
                      error={Boolean(errors.email)}
                      helperText={errors.email?.message}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handleValidEmail(e.target.value);
                      }}
                    />
                  )}
                />
                <Button
                  sx={{ minWidth: 120, maxHeight: 49 }}
                  onClick={() => handleCheckEmail()}
                  variant="contained"
                  color="secondary"
                  size="large"
                  disabled={!dirtyFields.email || validEmail}
                >
                  중복확인
                </Button>
              </Stack>
            </div>
            <div className="flex">
              <Label label="메모 (선택)" />
              <Controller
                control={control}
                name="memo"
                defaultValue={basicInfo?.memo}
                render={({ field }) => (
                  <div className="w-full text-right">
                    <TextField
                      sx={{ p: 0 }}
                      fullWidth
                      multiline
                      minRows={6}
                      inputProps={{ maxlength: 1000 }}
                      {...field}
                    />
                    <span className="text-12 leading-14 text-stone-600">
                      {
                        // isDirty ?
                        field.value?.length ? field.value?.length : 0
                      }
                      / 1000
                    </span>
                  </div>
                )}
              />
            </div>
            <div className="text-right">
              <Button
                sx={{ minWidth: 180 }}
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                저장
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    );
  }
);

BasicInfo.displayName = 'BasicInfo';

export { BasicInfo };
