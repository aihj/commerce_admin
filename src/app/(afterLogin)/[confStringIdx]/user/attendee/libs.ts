import { REGISTRATION_STATUS } from '@/api/types/attendeeTypes';

export const registrationStatusColor = (status: REGISTRATION_STATUS) => {
  if (status === REGISTRATION_STATUS.onSiteRegistered) {
    return 'text-info-dark font-medium';
  }
  return 'text-secondary-darkest';
};
