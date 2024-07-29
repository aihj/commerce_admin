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
