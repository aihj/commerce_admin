enum REGISTER_STATUS {
  unregistered = '미등록',
  payment_failed = '결제대기',
  registered = '등록완료',
  cancelled = '등록취소',
}

enum PAYMENT_STATUS {
  freeRegi = '무료옵션',
  freeRegiCancelled = '무료옵션 취소',
  paymentCompleted = '결제완료',
  refundCompleted = '횐불완료',
  pendingPayment = '결제대기',
}

export { REGISTER_STATUS, PAYMENT_STATUS };
