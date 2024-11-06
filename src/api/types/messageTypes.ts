import { TableSearchParams } from './tableSearchParams';

interface sendSMSRequest {
  letterTemplateIdx: number | null; // 양식을 선택안했을때는 null로
  subject?: string;
  content: string;
  memo: string;
  type: string; // default value: 'custom'
  messageType: string;
  senderPhoneNumber: string;
  scheduleType: number;
}
export interface sendSMSFilteredUsersRequest extends sendSMSRequest {
  // searchParamJson: Filter;
  searchParamJson: string;
  conferenceIdx: number;
}

export interface sendSMSTestRequest extends sendSMSRequest {
  conferenceIdx: number;
  testPhoneNumber?: string;
}

export interface sendSMSSelectedUsersRequest extends sendSMSRequest {
  conferenceIdx: number;
  wuserListJson: string;
}

export interface sendSMSDirectlyAddedUsersRequest extends sendSMSRequest {
  conferenceIdx: number;
  userListJson: string;
}

export enum TASK_STATUS {
  inInProgress = 'in_progress',
  inInComplete = 'interior_complete',
  apiInProgress = 'api_in_progress',
  complete = 'api_complete',
  failure = 'interior_fail',
}

export const taskStatusLabels = {
  [TASK_STATUS.inInProgress]: '발송중',
  [TASK_STATUS.inInComplete]: '발송중',
  [TASK_STATUS.apiInProgress]: '발송중',
  [TASK_STATUS.complete]: '발송완료',
  [TASK_STATUS.failure]: '발송실패',
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
  taskStatus: TASK_STATUS;
  senderWuserIdx?: number;
  messageType: string;
}

export interface SMSDetailListDT {
  letterItemIdx: number;
  letterItemSendDate: string;
  smsMsgId?: number | null;
  mmsMsgId?: number | null;
  receiverWuserIdx: number;
  phone: string;
  name: string;
  resultCode: string;
  resultDescription?: string;
}

export interface getSMSDetailRequest extends TableSearchParams {
  letterIdx: string;
}

export interface getSMSDetailResponse {
  letterIdx: number;
  templateIdx: number | null;
  count: number; // 전체 발송 건
  failureCount: number; // 실패 발송 건
  filterJson: string;
  type: string; // default 'custom';
  subject: string | null;
  content: string;
  memo: string;
  sendDate: string;
  completeDate: string | null;
  senderPhoneNumber: string;
  senderWuserIdx: number;
  senderName: string;
  messageType: string;
  receiverInfo: string;
  letterItemList: SMSDetailListDT[];
}

export interface resendFailedUserRequest {
  conferenceIdx: number;
  letterIdx: number;
  type: string; // failedTotal | selected
  letterItemIdxListJson?: string;
}

export interface getUsersWithNameOrPhoneRequest {
  conferenceIdx: number;
  type: string; // 현재 고정 값 'nameAndPhone'
  searchText: string;
}

export interface getUsersWithNameOrPhoneResponse {
  wuserIdx: number;
  phone: string;
  name: string;
}
