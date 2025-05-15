'use client';

import { RegisterAttendeeListTypeToss } from '@/app/(afterLogin)/[confStringIdx]/user/attendee/register/list/RegisterAttendeeListTypeToss';
import { Pco } from '@/redux/slices/pcoSlice';
import { useAppSelector } from '@/redux/hooks';

const RegisterAttendeeList = () => {
  const pco: Pco = useAppSelector((state) => state.pco);
  if (pco.paymentMethod === 'toss_payment') {
    return <RegisterAttendeeListTypeToss />;
  } else {
    // return <RegisterAttendeeListTypeManual />;
    return null;
  }
};

export default RegisterAttendeeList;
