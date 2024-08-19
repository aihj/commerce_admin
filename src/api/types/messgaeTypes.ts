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
