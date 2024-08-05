import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import { Label } from '@/components/core/Label';

interface PaymentInfoData {
  regifieeName: string;
  regifeePrice: string;
  paymentStatus: string;
  paymentPrice: string;
  paymentDate: string;
  paymentMethod: string;
  discountedPrice?: string;
}

interface PaymentInfoProp {
  paymentInfo: PaymentInfoData;
}

const PaymentInfo = ({ paymentInfo }: PaymentInfoProp) => (
  <Accordion>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1-content"
      sx={{ fontSize: '16px', fontWeight: 600 }}
    >
      {paymentInfo.paymentDate.split(' ')[0]}
    </AccordionSummary>
    <AccordionDetails>
      <Stack spacing={2} direction={'column'}>
        <div className="flex">
          <Label label="등록 구분/금액" />
          <span className="text-14 text-stone-700 leading-16">
            {paymentInfo.regifieeName} {paymentInfo.regifeePrice}
          </span>
        </div>
        <div className="flex">
          <Label label="결제 상태" />
          <span className="text-14 text-stone-700 leading-16">
            {paymentInfo.paymentStatus}
          </span>
        </div>
        <div className="flex">
          <Label label="등록 일시/수단" />
          <span className="text-14 text-stone-700 leading-16">
            {paymentInfo.regifieeName}
          </span>
        </div>
      </Stack>
    </AccordionDetails>
  </Accordion>
);

export { PaymentInfo };
