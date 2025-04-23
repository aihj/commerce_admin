import { Card, CardContent, CardHeader } from '@mui/material';
import React, { forwardRef } from 'react';
import { PaymentInfo } from './PaymentInfo';
import { AttendeeRegisterPaymentsInfoResponse } from '@/api/types/attendeeTypes';

interface PaymentListInfoProp {
  paymentList: AttendeeRegisterPaymentsInfoResponse[] | undefined;
}

const PaymentListInfo = forwardRef(
  ({ paymentList }: PaymentListInfoProp, ref) => {
    if (paymentList?.length === 0) {
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
          title="전체 결제 내역"
        />
        <CardContent className="flex flex-col gap-12" sx={{ p: 3 }}>
          {paymentList?.map((paymentInfo) => (
            <PaymentInfo key={paymentInfo.paymentT} paymentInfo={paymentInfo} />
          ))}
        </CardContent>
      </Card>
    );
  }
);

PaymentListInfo.displayName = 'PaymentListInfo';

export { PaymentListInfo };
