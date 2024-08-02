/**
 * 가입 회원 DT
 */
export interface JoinAttendeeDtVo {
  attendeeIdx?: number;
  birthDate?: string;
  email?: string;
  gender?: string;
  name?: string;
  phone?: string;
  registrationStatus?: string;
  wuserCreateT?: string;
  wuserStatus?: string;
  memo: string;
}

/*** 등록 회원 DT*/
export interface RegisterAttendeeDtVo {
  wuserIdx: number;
  attendeeIdx?: number;

  name: string;
  birthYear: string;
  gender: string;

  // email?: string;
  // phone?: string;

  /* 결제 상태
    freeRegi:무료 등록|freeRegiCancelled:무료 등록 취소|paymentCompleted:결제 완료|refundCompleted:환불 완료|pendingPayment:결제 대기
  */
  paymentStatus: string;

  /* 등록 구분
    preRegi : 사전 등록|onSiteRegi : 현장 등록|cancelled:등록 취소
  */
  registrationStatus: string;
  hasMemo: boolean; //  메모 존재 여부

  // 추가 결제
  additionalPaidPrograms?: HashMap[];
  paymentMethod?: string; // 결제 수단
  amount?: number;
  indicatedAmount?: number;
}
