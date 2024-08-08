'use client';

import React, { forwardRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
import { DevTool } from '@hookform/devtools';

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
  handleBasicInfo: (data: BasicInfoForm) => void;
}

const BasicInfo = forwardRef(
  ({ basicInfo, userIdx, handleBasicInfo }: BasicInfoProp, ref) => {
    // const BasicInfo = forwardRef((props, ref) => {
    const {
      control,
      handleSubmit,
      // formState: { errors },
    } = useForm<BasicInfoForm>({ defaultValues: { wuserIdx: userIdx } });

    const onsubmit = (data: BasicInfoForm) => {
      console.log('data', data);
      handleBasicInfo(data);
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
                  defaultValue={basicInfo?.name}
                  render={({ field }) => (
                    <TextField
                      label="이름"
                      sx={{ p: 0 }}
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
                  defaultValue={basicInfo?.phone}
                  render={({ field }) => (
                    <TextField sx={{ p: 0, width: 340 }} {...field} />
                  )}
                />
                <Button
                  sx={{ minWidth: 120 }}
                  color="secondary"
                  onClick={() => {
                    alert('휴대폰 번호 중복확인');
                  }}
                  variant="contained"
                  size="large"
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
                  defaultValue={basicInfo?.email}
                  render={({ field }) => (
                    <TextField sx={{ p: 0, width: 340 }} {...field} />
                  )}
                />
                <Button
                  sx={{ minWidth: 120 }}
                  onClick={() => {
                    alert('이메일 주소 중복확인');
                  }}
                  variant="contained"
                  color="secondary"
                  size="large"
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
                        field.value?.length
                          ? field.value?.length
                          : basicInfo?.memo.length
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
