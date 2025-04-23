import React, { forwardRef } from 'react';
import { Card, CardContent, CardHeader, Stack } from '@mui/material';
import { numberWithComma } from '@/lib/numberWithComma';
import { Label } from '@/components/core/Label';
import { AttendeeDetailTypeRegiInfoResponse } from '@/api/types/attendeeTypes';
import dayjs from 'dayjs';

interface RegisterInfoProp {
  registerInfo: AttendeeDetailTypeRegiInfoResponse | null | undefined;
}

const RegisterInfo = forwardRef(({ registerInfo }: RegisterInfoProp, ref) => {
  if (registerInfo === null) {
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
        title="학회 등록 정보"
      />
      <CardContent className="flex flex-col gap-24" sx={{ p: 3 }}>
        <Stack spacing={2} direction={'column'}>
          <div className="flex">
            <Label label="등록 타입" minWidth={140} />
            <span className="text-14 text-stone-700 leading-16">
              {registerInfo?.productType === 'early'
                ? '사전 등록'
                : '현장 등록'}
            </span>
          </div>
          <div className="flex">
            <Label label="등록 구분" minWidth={140} />
            <span className="text-14 text-stone-700 leading-16">
              {registerInfo?.productName}
            </span>
          </div>
          <div className="flex">
            <Label label="등록 금액" minWidth={140} />
            <span className="text-14 text-stone-700 leading-16">
              {registerInfo?.orderAmount &&
                numberWithComma(registerInfo?.orderAmount)}
            </span>
          </div>
          <div className="flex">
            <Label label="등록 일시" minWidth={140} />
            <span className="text-14 text-stone-700 leading-16">
              {dayjs(registerInfo?.registrationAt).format(
                'YYYY-MM-DD hh:mm:ss'
              )}
            </span>
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
});

RegisterInfo.displayName = 'RegisterInfo';

export { RegisterInfo };
