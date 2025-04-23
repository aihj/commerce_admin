import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import { Label } from '@/components/core/Label';
import { AttendeeRegisterPaymentsInfoResponse } from '@/api/types/attendeeTypes';
import { numberWithComma } from '@/lib/numberWithComma';
import dayjs from 'dayjs';

interface PaymentInfoProp {
  paymentInfo: AttendeeRegisterPaymentsInfoResponse;
}

const PaymentInfo = ({ paymentInfo }: PaymentInfoProp) => (
  <Accordion>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1-content"
      sx={{ fontSize: '16px', fontWeight: 600 }}
    >
      {paymentInfo.paymentT.split('T')[0]}{' '}
      {paymentInfo?.paymentStatus === 'payment_completed'
        ? '결제 완료'
        : '결제 취소'}
    </AccordionSummary>
    <AccordionDetails>
      <Stack spacing={2} direction={'column'}>
        <div className="flex">
          <Label label="등록 구분/금액" />
          <span className="text-14 text-stone-700 leading-16">
            {paymentInfo.productName} {numberWithComma(paymentInfo.orderAmount)}
          </span>
        </div>
        <div className="flex">
          <Label label="등록 일시/수단" />
          <span className="text-14 text-stone-700 leading-16">
            {`${dayjs(paymentInfo.paymentT).format('YYYY-MM-DD hh:mm:ss')} / ${paymentInfo.paymentMethod}`}
          </span>
        </div>
      </Stack>
    </AccordionDetails>
  </Accordion>
);

export { PaymentInfo };
