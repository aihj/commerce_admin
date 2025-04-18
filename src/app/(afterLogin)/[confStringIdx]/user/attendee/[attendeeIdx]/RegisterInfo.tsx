import React, { forwardRef } from 'react';
import { Card, CardContent, CardHeader, Stack } from '@mui/material';
import { numberWithComma } from '@/lib/numberWithComma';
import { Label } from '@/components/core/Label';
import { PAYMENT_STATUS, REGISTER_STATUS } from '@/constants/registerStatus';
import { AttendeeDetailTypeRegiInfoResponse } from '@/api/types/attendeeTypes';

interface RegisterInfoProp {
  registerInfo: AttendeeDetailTypeRegiInfoResponse | null | undefined;
}

// const ProgramPrice = ({ title, price }: { title: string; price: string }) => (
//   <div className="text-13 leading-18 text-stone-700 py-7 px-10 rounded-12 border border-secondary-light bg-secondary-lightest">
//     {title} {numberWithComma(Number(price))}
//   </div>
// );

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
            <Label label="등록 상태" minWidth={140} />
            <span className="text-14 text-stone-700 leading-16">
              {registerInfo?.registrationStatus &&
                REGISTER_STATUS[registerInfo?.registrationStatus]}
            </span>
          </div>
          <div className="flex">
            <Label label="등록 구분" minWidth={140} />
            <span className="text-14 text-stone-700 leading-16">
              {registerInfo?.regiFeeName}
            </span>
          </div>
          <div className="flex">
            <Label label="등록 구분 금액" minWidth={140} />
            <span className="text-14 text-stone-700 leading-16">
              {registerInfo?.regiFeeAmount &&
                numberWithComma(registerInfo?.regiFeeAmount)}
            </span>
          </div>
          <div className="flex">
            <Label label="등록 일시" minWidth={140} />
            <span className="text-14 text-stone-700 leading-16">
              {registerInfo?.registrationAt}
            </span>
          </div>
          <div className="flex">
            <Label label="결제 상태" minWidth={140} />
            <span className="text-14 text-stone-700 leading-16">
              {registerInfo?.paymentStatus &&
                PAYMENT_STATUS[registerInfo?.paymentStatus]}
            </span>
          </div>
          {/* <div className="flex">
            <Label label="강좌 금액" minWidth={140} />
            <span className="text-14 text-stone-700 leading-16">
              <ProgramPrice title="병원임직원 Session A" price="150000" />
            </span>
          </div> */}
          <div className="flex">
            <Label label="초청코드" minWidth={140} />
            <span className="text-14 text-stone-700 leading-16">
              {registerInfo?.discountCode === null
                ? '없음'
                : registerInfo?.discountCode}
            </span>
          </div>
          <div className="flex">
            <Label label="할인 금액" minWidth={140} />
            <span className="text-14 text-stone-700 leading-16">
              {registerInfo?.regiFeeAmount &&
                numberWithComma(registerInfo?.regiFeeAmount)}
            </span>
          </div>
          <div className="flex">
            <Label label="최종 결제 금액" minWidth={140} />
            <span className="text-14 text-stone-700 leading-16">
              {registerInfo?.regiFeeAmount &&
                numberWithComma(registerInfo?.regiFeeAmount)}
            </span>
          </div>

          {/* <div className="flex">
            <Label label="결제 영수증" minWidth={140} />
            <Button
              sx={{
                color: 'white',
                background: 'var(--color-secondary-darkest)',
                fontSize: '13px',
                lineHeight: '22px',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '12px',
              }}
              disableRipple
              onClick={() => alert('지금은 알럿')}
            >
              결제 영수증 확인하기
            </Button>
            <span className="text-14 text-stone-700 leading-16"></span>
          </div> */}
        </Stack>
      </CardContent>
    </Card>
  );
});

RegisterInfo.displayName = 'RegisterInfo';

export { RegisterInfo };
