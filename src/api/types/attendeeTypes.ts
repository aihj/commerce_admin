import { HashMap } from './commonTypes';

/**
 * 가입 회원 DT
 */
export interface JoinAttendeeDtVo {
  wuserIdx: number;
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

/** 회원 상세 (약관 동의) */
export interface AttendeeTermsAgreeInfoResponse {
  isSelect: string;
  title: string;
  termsIdx: number;
}

/** 회원 상세 (회원의 학회 등록 세부 정보) */
export interface AttendeeRegisterInfoResponse {
  attendeeOptionIdx: number;
  attendeeIdx: number;
  optionIdx: number;
  optionValue: string;
}

/** 회원 상세 (회원의 학회 등록 정보) */
export interface AttendeeDetailTypeRegiInfoResponse {
  registrationStatus: 'unregistered' | 'preRegi' | 'onSiteRegi' | 'cancelled';
  discountCode?: string;
  indicatedAmount?: number;
  paymentAmount?: number;
  regiFeeAmount?: number;
  regiFeeName?: string;
  paymentStatus?:
    | 'freeRegi'
    | 'freeRegiCancelled'
    | 'paymentCompleted'
    | 'refundCompleted'
    | 'pendingPayment';
  registrationAt: string;
}

export interface AttendeeRegisterPaymentsInfoResponse {
  type: string;
  regiFeeName: string;
  amount: number;
  paymentStatus:
    | 'freeRegi'
    | 'freeRegiCancelled'
    | 'paymentCompleted'
    | 'refundCompleted'
    | 'pendingPayment';
  paymentCreateT: string;
  paymentMethod: string;
}

export interface AttendeeTermsInfoRequest {
  wuserIdx: number;
  termsJson: string;
}

export interface AttendeeRegisterDetailInfoRequest {
  conferenceIdx: number;
  wuserIdx: number;
  optionsJson: string;
}
