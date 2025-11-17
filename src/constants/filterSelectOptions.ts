import { FACULTY_STATUS, facultyStatusLabels } from '@/api/types/facultyTypes';
import { TASK_STATUS, taskStatusLabels } from '@/api/types/messageTypes';

export const GENDERS = [
  { value: 'M', label: '남성' },
  { value: 'F', label: '여성' },
];

export const WUSER_STATUS = [
  { value: 'prospective', label: '기회원' },
  { value: 'active', label: '회원' },
  { value: 'delete', label: '탈퇴' },
];

export const BIRTH_YEAR_RANGE = Array.from(Array(125)).map((_, i) => {
  return { value: (2005 - i).toString(), label: (2005 - i).toString() };
});

export const REGISTRATION_STATUS = [
  { value: 'preRegistered', label: '사전 등록' },
  { value: 'onSiteRegistered', label: '현장 등록' },
  // { value: 'cancelled', label: '등록 취소' },
  // { value: 'unregistered', label: '미등록' },
];

export const PAYMENT_STATUS = [
  { value: 'freeRegi', label: '무료 등록' },
  { value: 'freeRegiCancelled', label: '무료 등록 취소' },
  { value: 'paymentCompleted', label: '결제 완료' },
  { value: 'refundCompleted', label: '환불 완료' },
  { value: 'pendingPayment', label: '결제 대기' },
];

export const HAS_MEMO = [
  { value: true, label: '메모 있음' },
  { value: false, label: '메모 없음' },
];

export const SEND_STATUS_OPTIONS = [
  {
    value: TASK_STATUS.sending,
    label: taskStatusLabels[TASK_STATUS.sending],
  },
  {
    value: TASK_STATUS.complete,
    label: taskStatusLabels[TASK_STATUS.complete],
  },
  {
    value: TASK_STATUS.failure,
    label: taskStatusLabels[TASK_STATUS.failure],
  },
  {
    value: TASK_STATUS.scheduled,
    label: taskStatusLabels[TASK_STATUS.scheduled],
  },
  {
    value: TASK_STATUS.scheduleCancelled,
    label: taskStatusLabels[TASK_STATUS.scheduleCancelled],
  },
];

export const IS_FAIL = [
  { value: true, label: '실패 건 있음' },
  { value: false, label: '실패 건 없음' },
];

export const CONFERENCE_APPLY_STATUS = [
  { value: 'apply', label: '대기' },
  { value: 'active', label: '등록' },
  { value: 'delete', label: '미등록' },
];

export const FACULTY_STATUS_SEARCH_OPTIONS = [
  {
    value: FACULTY_STATUS.active,
    label: facultyStatusLabels[FACULTY_STATUS.active],
  },
  {
    value: FACULTY_STATUS.inactive,
    label: facultyStatusLabels[FACULTY_STATUS.inactive],
  },
];
