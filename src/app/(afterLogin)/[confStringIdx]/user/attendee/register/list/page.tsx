'use client';

import { RegisterAttendeeListTypeToss } from '@/app/(afterLogin)/[confStringIdx]/user/attendee/register/list/RegisterAttendeeListTypeToss';
import { Pco } from '@/redux/slices/pcoSlice';
import { useAppSelector } from '@/redux/hooks';
import { RegisterAttendeeListTypeManual } from '@/app/(afterLogin)/[confStringIdx]/user/attendee/register/list/RegisterAttendeeListTypeManual';

const RegisterAttendeeList = () => {
  const pco: Pco = useAppSelector((state) => state.pco);
  console.log('pco.paymentMethod', pco.paymentMethod);
  if (pco.paymentMethod === 'toss_payment') {
    return <RegisterAttendeeListTypeToss />;
  } else {
    return <RegisterAttendeeListTypeManual />;
  }
};

export default RegisterAttendeeList;
