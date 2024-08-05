import { Card, CardContent, CardHeader } from '@mui/material';
import React, { forwardRef } from 'react';
import { PaymentInfo } from './PaymentInfo';

const dummy = [
  {
    // title: '2024.08.01',
    regifieeName: '전공의',
    regifeePrice: '15000',
    paymentStatus: '결제 완료',
    paymentPrice: '55000',
    paymentDate: '2024-07-27 13:03:20"',
    paymentMethod: '신용카드',
  },
  {
    // title: '2024.08.01',
    regifieeName: '전문의',
    regifeePrice: '15000',
    paymentStatus: '결제 완료',
    paymentPrice: '15000',
    paymentDate: '2024-08-01 17:03:20"',
    paymentMethod: '신용카드',
  },
];

// interface PaymentListInfoProp {}

const PaymentListInfo = forwardRef((props, ref) => {
  console.log(props);
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
      <CardContent className="flex flex-col gap-24" sx={{ p: 3 }}>
        {dummy.map((paymentInfo) => (
          <PaymentInfo
            key={paymentInfo.paymentDate}
            paymentInfo={paymentInfo}
          />
        ))}
      </CardContent>
    </Card>
  );
});

PaymentListInfo.displayName = 'PaymentListInfo';

export { PaymentListInfo };
