import {
  PAYMENT_STATUS,
  REGISTRATION_STATUS,
  USER_STATUS,
} from '@/api/types/attendeeTypes';
import { TASK_STATUS } from '@/api/types/messageTypes';
import { CHIP_COLOR } from '@/components/core/Chip';

export const setUserStatusChipColor = (status: USER_STATUS) => {
  switch (status) {
    case USER_STATUS.active:
      return CHIP_COLOR.secondary;
    case USER_STATUS.prospective:
      return CHIP_COLOR.primary;
    case USER_STATUS.delete:
      return CHIP_COLOR.error;
    default:
      return CHIP_COLOR.secondary;
  }
};

export const setRegistrationStatusChipColor = (status: REGISTRATION_STATUS) => {
  switch (status) {
    case REGISTRATION_STATUS.preRegistered:
      return CHIP_COLOR.secondary;
    case REGISTRATION_STATUS.onSiteRegistered:
      return CHIP_COLOR.success;
    case REGISTRATION_STATUS.cancelled:
      return CHIP_COLOR.error;
    case REGISTRATION_STATUS.unregistered:
      return CHIP_COLOR.neutral;
    default:
      return CHIP_COLOR.secondary;
  }
};

export const setPaymentStatusChipColor = (status: PAYMENT_STATUS) => {
  switch (status) {
    case PAYMENT_STATUS.freeRegi:
      return CHIP_COLOR.info;
    case PAYMENT_STATUS.freeRegiCancelled:
      return CHIP_COLOR.waring;
    case PAYMENT_STATUS.paymentCompleted:
      return CHIP_COLOR.secondary;
    case PAYMENT_STATUS.pendingPayment:
      return CHIP_COLOR.neutral;
    case PAYMENT_STATUS.cancelCompleted:
      return CHIP_COLOR.pink;

    default:
      return CHIP_COLOR.secondary;
  }
};

export const setTaskStatusChipColor = (status: TASK_STATUS) => {
  switch (status) {
    case TASK_STATUS.sending:
      return CHIP_COLOR.primary;
    case TASK_STATUS.sent:
      return CHIP_COLOR.primary;
    case TASK_STATUS.resultPending:
      return CHIP_COLOR.primary;
    case TASK_STATUS.complete:
      return CHIP_COLOR.neutral;
    case TASK_STATUS.scheduled:
      return CHIP_COLOR.primary;

    default:
      return CHIP_COLOR.neutral;
  }
};
