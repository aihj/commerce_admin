/**
 * 가입 회원 DT
 */
import { HashMap } from '@/api/types/commonTypes';

// 성별
export enum GENDER {
  F = 'F',
  M = 'M',
}

export const genderLabels = {
  [GENDER.F]: '여',
  [GENDER.M]: '남',
};

// 등록구분
export enum REGISTRATION_STATUS {
  preRegistered = 'preRegistered',
  onSiteRegistered = 'onSiteRegistered',
  cancelled = 'cancelled',
  unregistered = 'unregistered',
}

export const registrationStatusLabels = {
  [REGISTRATION_STATUS.preRegistered]: '사전 등록',
  [REGISTRATION_STATUS.onSiteRegistered]: '현장 등록',
  [REGISTRATION_STATUS.cancelled]: '등록 취소',
  [REGISTRATION_STATUS.unregistered]: '미등록',
};

// 결제 상태
export enum PAYMENT_STATUS {
  freeRegi = 'freeRegi',
  freeRegiCancelled = 'freeRegiCancelled',
  paymentCompleted = 'paymentCompleted',
  refundCompleted = 'refundCompleted',
  pendingPayment = 'pendingPayment',
}

export const paymentStatusLabels = {
  [PAYMENT_STATUS.freeRegi]: '무료 등록',
  [PAYMENT_STATUS.freeRegiCancelled]: '무료 등록 취소',
  [PAYMENT_STATUS.paymentCompleted]: '결제 완료',
  [PAYMENT_STATUS.refundCompleted]: '환불 완료',
  [PAYMENT_STATUS.pendingPayment]: '결제 대기',
};

// 결제수단
export enum PAYMENT_METHOD {
  card = 'card',
  eWallet = 'eWallet',
  free = 'free',
  manual = 'manual',
}

export const paymentMethodLabels = {
  [PAYMENT_METHOD.card]: '카드',
  [PAYMENT_METHOD.eWallet]: '간편결제',
  [PAYMENT_METHOD.free]: '무료결제',
  [PAYMENT_METHOD.manual]: '수동 계좌이체',
};

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
  birthDate: string;
  gender: GENDER;

  /* 결제 상태
    freeRegi:무료 등록|freeRegiCancelled:무료 등록 취소|paymentCompleted:결제 완료|refundCompleted:환불 완료|pendingPayment:결제 대기
  */
  paymentStatus: PAYMENT_STATUS;
  registrationStatus: REGISTRATION_STATUS;
  registrationAt?: number;
  hasMemo: boolean; //  메모 존재 여부

  // 추가 결제
  additionalPaidPrograms?: HashMap[];
  paymentMethod?: PAYMENT_METHOD; // 결제 수단
  amount?: number;
  indicatedAmount?: number;
  memo: string;
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
