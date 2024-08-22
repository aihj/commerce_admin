import { Filter } from '@/app/(afterLogin)/[confStringIdx]/message/sms/send/Filters';

export interface sendSMSFilteredUsersRequest {
  searchParam: Filter;
  letterTemplateIdx: number | null; // 양식을 선택안했을때는 null로
  subject: string;
  content: string;
  memo: string;
  messageType: string; // default value: 'custom'
  senderPhoneNumber: string;
}

export interface sendSMSTestRequest {
  conferenceIdx: number;
  testPhoneNumber?: string;
  letterTemplateIdx: number | null; // 양식을 선택안했을때는 null로
  subject: string;
  content: string;
  memo: string;
  messageType: string; // default value: 'custom'
  senderPhoneNumber: string;
}

export enum SEND_STATUS {
  inProgress = 'inProgress',
  complete = 'complete',
  failure = 'failure',
}

export const sendStatusLabels = {
  [SEND_STATUS.inProgress]: '발송중',
  [SEND_STATUS.complete]: '발송완료',
  [SEND_STATUS.failure]: '발송실패',
};

export interface LetterDtResponse {
  completeDate?: string | null;
  content?: string;
  count?: number;
  failureCount?: number | null;
  hasMemo?: boolean;
  letterIdx?: number;
  memo?: string | null;
  receiverInfo?: string;
  sendDate?: string;
  senderName?: string;
  sendStatus: SEND_STATUS;
  senderWuserIdx?: number;
}

export interface SMSDetailListDT {
  letterItemIdx: number;
  letterItemSendDate: string;
  smsMsgId?: number | null;
  mmsMsgId?: number | null;
  receiverWuserIdx: number;
  phone: string;
  name: string;
  // sendStatus: SEND_STATUS;
  sendStatus: string;
  failReason?: string | null;
}
