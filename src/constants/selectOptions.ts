export const GENDERS = [
  { value: 'M', label: '남' },
  { value: 'F', label: '여' },
];

export const WUSER_STATUS = [
  { value: 'temp', label: '기회원' },
  { value: 'active', label: '회원' },
  { value: 'delete', label: '탈퇴' },
];

export const BIRTH_YEAR_RANGE = Array.from(Array(125)).map((_, i) => {
  return { value: (2005 - i).toString(), label: (2005 - i).toString() };
});

export const REGISTRATION_STATUS = [
  { value: 'preRegistered', label: '사전 등록' },
  { value: 'onSitePreregistered', label: '현장 등록' },
  { value: 'cancelled', label: '등록 취소' },
  { value: 'unregistered', label: '미등록' },
];

export const PAYMENT_STATUS = [
  { value: 'freeRegi', label: '무료 등록' },
  { value: 'freeRegiCancelled', label: '무료 등록 취소' },
  { value: 'paymentCompleted', label: '결제 완료' },
  { value: 'refundCompleted', label: '환불 완료' },
  { value: 'pendingPayment', label: '결제 대기' },
];
