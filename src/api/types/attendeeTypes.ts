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

// 회원상태
export enum USER_STATUS {
  active = 'active',
  prospective = 'prospective',
  delete = 'delete',
}

export const userStatusLabels = {
  [USER_STATUS.active]: '회원',
  [USER_STATUS.prospective]: '기회원',
  [USER_STATUS.delete]: '탈퇴',
};

// 등록구분
export enum REGISTRATION_STATUS {
  preRegistered = 'preRegistered',
  onSiteRegistered = 'onSiteRegistered',
  cancelled = 'cancelled',
  unregistered = 'unregistered',
}

export const registrationStatusLabels = {
  [REGISTRATION_STATUS.preRegistered]: '사전등록',
  [REGISTRATION_STATUS.onSiteRegistered]: '현장등록',
  [REGISTRATION_STATUS.cancelled]: '등록취소',
  [REGISTRATION_STATUS.unregistered]: '미등록',
};

// 결제 상태
export enum PAYMENT_STATUS {
  freeRegi = 'freeRegi',
  freeRegiCancelled = 'freeRegiCancelled',
  paymentCompleted = 'paymentCompleted',
  pendingPayment = 'pendingPayment',
  cancelRequest = 'cancelRequest',
  cancelCompleted = 'cancelCompleted',
}

export const paymentStatusLabels = {
  [PAYMENT_STATUS.freeRegi]: '무료등록',
  [PAYMENT_STATUS.freeRegiCancelled]: '무료등록취소',
  [PAYMENT_STATUS.paymentCompleted]: '결제완료',
  [PAYMENT_STATUS.pendingPayment]: '결제대기',
  [PAYMENT_STATUS.cancelRequest]: '취소요쳥',
  [PAYMENT_STATUS.cancelCompleted]: '환불완료',
};

// 결제 수단
export enum PAYMENT_METHOD {
  무료 = '무료',
  수동계좌이체 = '수동계좌이체',
  카드 = '카드',
  간편결제 = '간편결제',
  토스계좌이체 = '토스계좌이체',
}

// export const paymentMethodLabels = {
//   [PAYMENT_METHOD.card]: '카드',
//   [PAYMENT_METHOD.eWallet]: '간편결제',
//   [PAYMENT_METHOD.free]: '무료결제',
//   [PAYMENT_METHOD.manual]: '수동계좌이체',
// };

export interface getUsersResponse {
  wuserIdx: number;
  attendeeIdx: number;
  birthDate: string;
  email: string;
  gender: GENDER | null;
  name: string;
  phone: string;
  attendeeCreateT?: string;
  wuserRoleStatus: USER_STATUS;
  memo: string;
}

/*** 등록 회원 DT*/
export interface getRegisteredUsersResponse {
  wuserIdx: number;
  attendeeIdx?: number;
  name: string;
  birthDate: string;
  gender: GENDER;
  license: string;
  regiStatus: REGISTRATION_STATUS;
  registrationAt?: number;
  hasMemo: boolean; //  메모 존재 여부
  memo: string;
  regiName: string;
  paymentMethod: PAYMENT_METHOD;
  amount?: number;
  additionalPaidPrograms?: HashMap[]; // 추가 결제
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
  orderAmount?: number;
  productName?: string;
  productType?: string;
  registrationAt: string;
}

export interface AttendeeRegisterPaymentsInfoResponse {
  type: string;
  productName: string;
  orderAmount: number;
  paymentStatus: 'payment_completed' | 'cancel_completed';
  paymentT: string;
  paymentMethod: string;
}

export interface AttendeeTermsInfoRequest {
  wuserIdx: number;
  termsJson: string;
}

export interface AttendeeRegisterDetailInfoRequest {
  conferenceIdx: number;
  attendeeIdx: number;
  optionsJson: string;
}

export interface RegistrationTypeResponse {
  regifeeIdx: number;
  conferenceIdx: number;
  regifeeName: string;
  regifeePrice: number;
  isPreRegistration: 1 | 0;
  status: string;
  selectedCount: number;
  limitCount: number;
}
