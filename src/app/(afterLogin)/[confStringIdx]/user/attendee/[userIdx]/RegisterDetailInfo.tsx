'use client';

import React, { forwardRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  TextField,
} from '@mui/material';
import {
  RegisterDetailOptionsState,
  RegisterOptions,
  RegisterOptionsType,
} from '@/constants/registerOptions';
import { AttendeeRegisterDetailInfoRequest } from '@/api/types/attendeeTypes';

interface RegisterDetailInfoProp {
  options: RegisterDetailOptionsState[] | null | undefined;
  conferenceIdx: number;
  userIdx: number;
  handleRegisterDetailInfo: (data: AttendeeRegisterDetailInfoRequest) => void;
}

const RegisterDetailInfo = forwardRef(
  (
    {
      options,
      conferenceIdx,
      userIdx,
      handleRegisterDetailInfo,
    }: RegisterDetailInfoProp,
    ref
  ) => {
    const {
      control,
      handleSubmit,
      // formState: { errors, isDirty },
    } = useForm<RegisterOptionsType>({});

    const onSubmit = (data: RegisterOptionsType) => {
      type RegisterOptionsFormType = {
        [key: string]: any; // 모든 키가 string이고 값이 any인 객체
      };
      const newData: RegisterOptionsFormType = data;

      const transform = (
        newData: RegisterOptionsFormType
      ): { [key: string]: any }[] => {
        const options = Object.keys(newData).map((key) => ({
          [key]: newData[key],
        }));

        return options;
      };

      const optionsString = JSON.stringify(transform(newData));
      const formData: AttendeeRegisterDetailInfoRequest = {
        conferenceIdx,
        wuserIdx: userIdx,
        optionsJson: optionsString,
      };
      handleRegisterDetailInfo(formData);
    };
    if (options === null) {
      return;
    }
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
          title="학회 등록 세부 정보"
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-24" sx={{ p: 3 }}>
            <Stack spacing={3} sx={{ p: 3 }}>
              {options?.map((option) => (
                <Controller
                  key={option.idx}
                  control={control}
                  name={option.key as RegisterOptions}
                  defaultValue={option.value || ''}
                  render={({ field }) => (
                    <TextField
                      label={option.label}
                      sx={{ p: 0 }}
                      fullWidth
                      {...field}
                    />
                  )}
                />
              ))}
            </Stack>
            <div className="text-right">
              <Button
                sx={{ minWidth: 180 }}
                variant="contained"
                color="primary"
                size="large"
                type="submit"
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

RegisterDetailInfo.displayName = 'RegisterDetailInfo';

export { RegisterDetailInfo };
