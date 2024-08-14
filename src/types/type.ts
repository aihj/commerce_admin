// 페이지 첫 로딩시 가져오는 학회 기본 정보
import {
  ResponseMessageVoErrorCause,
  ResponseMessageVoErrorStackTraceItem,
  ResponseMessageVoErrorSuppressedItem,
} from '@/orval/model';

export interface PcoBaseInfoVo {
  committeeAddr?: string;
  committeeCompanyRegiNumber?: string;
  committeeName?: string;
  conferenceEndT?: string;
  conferenceIdx?: number;
  conferenceName?: string;
  conferencePreRegiEndT?: string;
  conferencePreRegiStartT?: string;
  conferenceStartT?: string;
  conferenceStringIdx?: string;
  frontendServerUrl?: string;
  logoHost?: string;
  logoName?: string;
  logoPath?: string;
  sendPaymentReceiptEmail?: string;
  paymentMethod: string;
}

export interface Committee {
  committeeIdx: number;
  committeeName: string;
  committeeDesc: string;
  committeeContactNumber: string;
  committeeEmail: string;
  committeeAddr: string;
  committeeRegistrationT: Date;
  committeeCompanyRegiNumber: string; // 사업자 등록 번호
  isAvailable: number;
  isEnterprise: number;
}

export interface Conference {
  conferenceIdx: number;
  conferenceStringIdx: string;
  conferenceName: string;
  conferenceDesc: string;
  conferenceStartT: Date;
  conferenceEndT: Date;
  conferencePreRegiStartT: Date;
  conferencePreRegiEndT: Date;
  conferenceRegistrationT: Date;
  conferenceApplyType: 'pre' | 'onsite' | 'all' | 'n/a';
  essentialCredit: number;
  electiveCredit: number;
  isOnline: 0 | 1;
  homeUrl: string;
}

// 제휴일때만 사용하는 컬럼
export interface ConferenceAlliance {
  preUrl: string;
  cost: string;
  openContact: string;
  kmaCode: string;
  channelNewsIdx: string;
  conferenceApplyStatus: string;
}

export interface ConferenceEnterprise {
  conferenceEnterpriseIdx: string;
  conferenceIdx: string;
  stringIdx: string;
  needAppAuth: string;
  clientOpenStatus: string;
  adminOpenStatus: string;
  languageType: string;
  templateType: string;
}

export interface Category {}

export interface SessionGroup {
  sessionGroupStartT?: string;
  sessionGroupEndT?: string;
  sessionStartT?: string;
  sessionEndT?: string;
  sessionGroupIdx: number;
}
export interface Session {}

export interface ResponseMessageVo<T> {
  code?: string;
  content?: T;
  error?: ResponseMessageVoError;
  message?: string;
  status?: number;
  totalCount: number;
}

export type ResponseMessageVoError = {
  cause?: ResponseMessageVoErrorCause;
  localizedMessage?: string;
  message?: string;
  stackTrace?: ResponseMessageVoErrorStackTraceItem[];
  suppressed?: ResponseMessageVoErrorSuppressedItem[];
};
