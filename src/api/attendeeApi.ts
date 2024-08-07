import { adminAxiosInstance } from '@/api/authApi';
import {
  AttendeeDetailTypeRegiInfoResponse,
  AttendeeRegisterInfoResponse,
  AttendeeRegisterPaymentsInfoResponse,
  AttendeeTermsAgreeInfoResponse,
  JoinAttendeeDtVo,
  RegisterAttendeeDtVo,
} from '@/api/types/attendeeTypes';
import { ResponseMessageVo } from '@/types/type';
import { logger } from '@/lib/logger/defaultLogger';
import { JoinAttendeeListSearchParamsType } from '@/app/(afterLogin)/[confStringIdx]/user/attendee/join/list/page';

/**
 * 가입 회원 리스트 가져오기
 * @return regifeeIdx, wuserIdx
 * @param params
 */
export const getJoinAttendeeDt = (
  params: JoinAttendeeListSearchParamsType
): Promise<ResponseMessageVo<JoinAttendeeDtVo[]>> => {
  logger.debug('<getJoinAttendeeDt> params ', params);
  return adminAxiosInstance
    .post(`/api/pco/admin/total/join-attendee-dt`, params)
    .then((response) => {
      logger.debug('<getJoinAttendeeDt> response.data : ', response.data);
      return response.data;
    });
};

/**
 * 등록 회원 리스트 가져오기
 * @param params
 */
export const getRegisterAttendeeDt = (
  params: JoinAttendeeListSearchParamsType
): Promise<ResponseMessageVo<RegisterAttendeeDtVo>> => {
  logger.debug('<getRegisterAttendeeDt> params ', params);
  return adminAxiosInstance
    .post(`/api/pco/admin/total/register-attendee-dt`, params)
    .then((response) => {
      logger.debug('<getJoinAttendeeDt> response.data : ', response.data);
      return response.data;
    });
};

/**
 * 회원 상세 가져오기(일반정보)
 * @return JoinAttendeeDtVo
 * @param wuserIdx
 */
export const getAttendeeBasicInfo = (
  wuserIdx: number
): Promise<ResponseMessageVo<JoinAttendeeDtVo>> => {
  return adminAxiosInstance
    .get(`/api/pco/admin/total/attendee/join-info/${wuserIdx}`)
    .then((response) => {
      logger.debug(
        `<getAttendeeBasicInfo> response.data ${wuserIdx} : `,
        response.data
      );
      return response.data;
    });
};

/**
 * 회원 상세 가져오기(약관동의)
 * @return JoinAttendeeDtVo
 * @param wuserIdx
 */
export const getAttendeeTermsInfo = (
  wuserIdx: number
): Promise<ResponseMessageVo<AttendeeTermsAgreeInfoResponse[]>> => {
  return adminAxiosInstance
    .get(`/api/pco/admin/total/attendee/select-terms/${wuserIdx}`)
    .then((response) => {
      logger.debug(
        `<getAttendeeTermsInfo> response.data ${wuserIdx} : `,
        response.data
      );
      return response.data;
    });
};

/**
 * 회원 상세 가져오기(학회 세부 등록 옵션 정보)
 * @return AttendeeRegisterInfoResponse[]
 * @param wuserIdx
 */
export const getAttendeeRegisterDetailOptionInfo = (
  wuserIdx: number
): Promise<ResponseMessageVo<AttendeeRegisterInfoResponse[]>> => {
  return adminAxiosInstance
    .get(`/api/pco/admin/total/attendee/option/${wuserIdx}`)
    .then((response) => {
      logger.debug(
        `<getAttendeeRegisterDetailOptionInfo> response.data ${wuserIdx} : `,
        response.data
      );
      return response.data;
    });
};

/**
 * 회원 상세 가져오기(학회 등록 정보)
 * @return AttendeeDetailTypeRegiInfoResponse[]
 * @param wuserIdx
 */
export const getAttendeeRegisterInfo = (
  wuserIdx: number
): Promise<ResponseMessageVo<AttendeeDetailTypeRegiInfoResponse>> => {
  return adminAxiosInstance
    .get(`/api/pco/admin/total/attendee/regi-info/${wuserIdx}`)
    .then((response) => {
      logger.debug(
        `<getAttendeeRegisterInfo> response.data ${wuserIdx} : `,
        response.data
      );
      return response.data;
    });
};

/**
 * 회원 상세 가져오기(결제 내역)
 * @return AttendeeRegisterPaymentsInfoResponse[]
 * @param wuserIdx
 */
export const getAttendeeRegisterPaymentsInfo = (
  wuserIdx: number
): Promise<ResponseMessageVo<AttendeeRegisterPaymentsInfoResponse[]>> => {
  return adminAxiosInstance
    .get(`/api/pco/admin/total/attendee/payment-history/${wuserIdx}`)
    .then((response) => {
      logger.debug(
        `<getAttendeeRegisterPaymentsInfo> response.data ${wuserIdx} : `,
        response.data
      );
      return response.data;
    });
};
