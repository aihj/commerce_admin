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
import { PAYMENT_STATUS } from '@/constants/registerStatus';

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
      {paymentInfo.paymentCreateT.split(' ')[0]}
    </AccordionSummary>
    <AccordionDetails>
      <Stack spacing={2} direction={'column'}>
        <div className="flex">
          <Label label="등록 구분/금액" />
          <span className="text-14 text-stone-700 leading-16">
            {paymentInfo.regiFeeName} {numberWithComma(paymentInfo.amount)}
          </span>
        </div>
        <div className="flex">
          <Label label="결제 상태" />
          <span className="text-14 text-stone-700 leading-16">
            {paymentInfo?.paymentStatus &&
              PAYMENT_STATUS[paymentInfo?.paymentStatus]}
          </span>
        </div>
        <div className="flex">
          <Label label="등록 일시/수단" />
          <span className="text-14 text-stone-700 leading-16">
            {`${paymentInfo.paymentCreateT} / ${paymentInfo.paymentMethod}`}
          </span>
        </div>
      </Stack>
    </AccordionDetails>
  </Accordion>
);

export { PaymentInfo };
