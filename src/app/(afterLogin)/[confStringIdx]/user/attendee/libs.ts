import { REGISTRATION_STATUS } from '@/api/types/attendeeTypes';

// chip 으로 업데이트
export const registrationStatusColor = (status: REGISTRATION_STATUS) => {
  if (status === REGISTRATION_STATUS.onSiteRegistered) {
    return 'text-info-dark font-medium';
  }
  return 'text-secondary-darkest';
};

// 회원상태 / 결제상태도 추가예정
