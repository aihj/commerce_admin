'use client';

import { useSelector } from 'react-redux';
import { selectUserRoleNameList } from '@/redux/slices/userSlice';

const useUserRole = () => {
  const userRole = useSelector(selectUserRoleNameList);

  const topRole = userRole[0].wroleName === 'pco_admin_all_top';

  return { topRole };
};

export { useUserRole };
