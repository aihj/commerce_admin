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

interface RegisterDetailInfoForm {
  englishName: string;
  license: string;
}

const dummy = [{ label: '개원의', value: '개원의' }];

// interface RegisterDetailInfoProp {}

const RegisterDetailInfo = forwardRef((props, ref) => {
  console.log(props);
  const {
    control,
    // handleSubmit,
    // formState: { errors, isDirty },
  } = useForm<RegisterDetailInfoForm>({});
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
      <form>
        <CardContent className="flex flex-col gap-24" sx={{ p: 3 }}>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Controller
              control={control}
              name="englishName"
              render={({ field }) => (
                <TextField
                  label="영문 이름"
                  sx={{ p: 0 }}
                  fullWidth
                  //    defaultValue="Hello World"
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="englishName"
              render={({ field }) => (
                <TextField
                  label="병원명"
                  sx={{ p: 0 }}
                  fullWidth
                  //    defaultValue="Hello World"
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="englishName"
              render={({ field }) => (
                <TextField
                  label="근무 형태"
                  select
                  sx={{ p: 0 }}
                  fullWidth
                  //    defaultValue="Hello World"
                  {...field}
                >
                  {dummy.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              control={control}
              name="license"
              render={({ field }) => (
                <TextField
                  label="면허번호"
                  sx={{ p: 0 }}
                  fullWidth
                  //    defaultValue="Hello World"
                  {...field}
                />
              )}
            />
          </Stack>
          <div className="text-right">
            <Button
              sx={{ minWidth: 180 }}
              onClick={() => {
                alert('데이터를 저장');
              }}
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
});

RegisterDetailInfo.displayName = 'RegisterDetailInfo';

export { RegisterDetailInfo };
