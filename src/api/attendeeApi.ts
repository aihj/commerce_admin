import { adminAxiosInstance } from '@/api/authApi';
import {
  AttendeeDetailTypeRegiInfoResponse,
  AttendeeRegisterDetailInfoRequest,
  AttendeeRegisterInfoResponse,
  AttendeeRegisterPaymentsInfoResponse,
  AttendeeTermsAgreeInfoResponse,
  AttendeeTermsInfoRequest,
  getRegisteredUsersResponse,
  getUsersResponse,
} from '@/api/types/attendeeTypes';
import { ResponseMessageVo } from '@/types/type';
import { logger } from '@/lib/logger/defaultLogger';
import { JoinAttendeeListSearchParamsType } from '@/app/(afterLogin)/[confStringIdx]/user/attendee/join/list/page';
import { RegisterAttendeeListTypeManualSearchParamsType } from '@/app/(afterLogin)/[confStringIdx]/user/attendee/register/list/RegisterAttendeeListTypeManual';
import { RegisterAttendeeListTypeTossSearchParamsType } from '@/app/(afterLogin)/[confStringIdx]/user/attendee/register/list/RegisterAttendeeListTypeToss';
import { BasicInfoForm } from '@/app/(afterLogin)/[confStringIdx]/user/attendee/[attendeeIdx]/BasicInfo';

/**
 * 가입 회원 리스트 가져오기
 * @return regifeeIdx, wuserIdx
 * @param params
 */
export const getUsers = (
  params: JoinAttendeeListSearchParamsType
): Promise<ResponseMessageVo<getUsersResponse[]>> => {
  logger.debug('<getUsers> params ', params);
  return adminAxiosInstance
    .post(`/api/pco/admin/attendee`, params)
    .then((response) => {
      logger.debug('<getUsers> response.data : ', response.data);
      return response.data;
    });
};

/**
 * 등록 회원 리스트 가져오기(결제 방식이 토스인경우)
 * @param params
 */
export const getRegisteredUsers = (
  params: RegisterAttendeeListTypeTossSearchParamsType
): Promise<ResponseMessageVo<getRegisteredUsersResponse[]>> => {
  logger.debug('<getRegisteredUsers> params ', params);
  return adminAxiosInstance
    .post(`/api/pco/admin/attendee/registered`, params)
    .then((response) => {
      logger.debug('<getRegisteredUsers> response.data : ', response.data);
      return response.data;
    });
};

/**
 * 등록 회원 리스트 가져오기(결제 방식이 수동계좌이체인경우)
 * @param params
 */
export const getRegisterAttendeeDtTypeManual = (
  params: RegisterAttendeeListTypeManualSearchParamsType
): Promise<ResponseMessageVo<getRegisteredUsersResponse[]>> => {
  logger.debug('<getRegisterAttendeeDtTypeManual> params ', params);
  return adminAxiosInstance
    .post(`/api/pco/admin/total/register-attendee-dt-manual`, params)
    .then((response) => {
      logger.debug('<getJoinAttendeeDt> response.data : ', response.data);
      return response.data;
    });
};

/**
 * 회원 상세 가져오기(일반정보)
 * @return getUsersResponse
 * @param attendeeIdx
 *
 * /pco/admin/attendee/{attendeeIdx}
 */
export const getAttendeeBasicInfo = (
  attendeeIdx: number
): Promise<ResponseMessageVo<getUsersResponse>> => {
  return adminAxiosInstance
    .get(`/api/pco/admin/attendee/${attendeeIdx}/join`)
    .then((response) => {
      logger.debug(
        `<getAttendeeBasicInfo> response.data ${attendeeIdx} : `,
        response.data
      );
      return response.data;
    });
};

/**
 * 회원 상세 가져오기(약관동의)
 * @return getUsersResponse
 * @param attendeeIdx
 */
export const getAttendeeTermsInfo = (
  attendeeIdx: number
): Promise<ResponseMessageVo<AttendeeTermsAgreeInfoResponse[]>> => {
  return adminAxiosInstance
    .get(`/api/pco/admin/attendee/${attendeeIdx}/terms`)
    .then((response) => {
      logger.debug(
        `<getAttendeeTermsInfo> response.data ${attendeeIdx} : `,
        response.data
      );
      return response.data;
    });
};

/**
 * 회원 상세 가져오기(학회 세부 등록 옵션 정보)
 * @return AttendeeRegisterInfoResponse[]
 * @param attendeeIdx
 */
export const getAttendeeRegisterDetailOptionInfo = (
  attendeeIdx: number
): Promise<ResponseMessageVo<AttendeeRegisterInfoResponse[]>> => {
  return adminAxiosInstance
    .get(`/api/pco/admin/attendee/${attendeeIdx}/option`)
    .then((response) => {
      logger.debug(
        `<getAttendeeRegisterDetailOptionInfo> response.data ${attendeeIdx} : `,
        response.data
      );
      return response.data;
    });
};

/**
 * 회원 상세 가져오기(학회 등록 정보)
 * @return AttendeeDetailTypeRegiInfoResponse[]
 * @param attendeeIdx
 */
export const getAttendeeRegisterInfo = (
  attendeeIdx: number
): Promise<ResponseMessageVo<AttendeeDetailTypeRegiInfoResponse>> => {
  return adminAxiosInstance
    .get(`/api/pco/admin/attendee/${attendeeIdx}/basic-plan`)
    .then((response) => {
      logger.debug(
        `<getAttendeeRegisterInfo> response.data ${attendeeIdx} : `,
        response.data
      );
      return response.data;
    });
};

/**
 * 회원 상세 가져오기(결제 내역)
 * @return AttendeeRegisterPaymentsInfoResponse[]
 * @param attendeeIdx
 */
export const getAttendeeRegisterPaymentsInfo = (
  attendeeIdx: number
): Promise<ResponseMessageVo<AttendeeRegisterPaymentsInfoResponse[]>> => {
  return adminAxiosInstance
    .get(`/api/pco/admin/attendee/${attendeeIdx}/payment-history`)
    .then((response) => {
      logger.debug(
        `<getAttendeeRegisterPaymentsInfo> response.data ${attendeeIdx} : `,
        response.data
      );
      return response.data;
    });
};

/**
 * 회원 상세 정보 수정(일반 정보)
 * @param BasicInfoForm
 * @returns null
 */
export const updateAttendeeBasicInfo = (
  params: BasicInfoForm
): Promise<ResponseMessageVo<null>> => {
  return adminAxiosInstance
    .post(`/api/pco/admin/attendee/join`, params)
    .then((response) => {
      logger.debug('<updateAttendeeBasicInfo> response.data : ', response.data);
      return response.data;
    });
};

export const updateAttendeeTermsInfo = (
  params: AttendeeTermsInfoRequest
): Promise<ResponseMessageVo<null>> => {
  return adminAxiosInstance
    .post(`/api/pco/admin/total/top/attendee/select-terms`, params)
    .then((response) => {
      logger.debug('<updateAttendeeTermsInfo> response.data : ', response.data);
      return response.data;
    });
};

/**
 * 회원 상세 정보 수정(학회 등록 세부 정보)
 * @param params AttendeeRegisterDetailInfoRequest
 * @returns null
 */
export const updateAttendeeRegisterDetailInfo = (
  params: AttendeeRegisterDetailInfoRequest
): Promise<ResponseMessageVo<null>> => {
  return adminAxiosInstance
    .post(`/api/pco/admin/total/top/attendee/option-v2`, params)
    .then((response) => {
      logger.debug(
        '<updateAttendeeRegisterDetailInfo> response.data : ',
        response.data
      );
      return response.data;
    });
};

/**
 * 수동 계좌이체의 manualStatus 변경
 * @param params
 */
export const attendeePaymentManualStatusChange = (
  attendeePaymentIdx: number,
  desiredStatus: string
): Promise<ResponseMessageVo<any>> => {
  // logger.debug('<getRegisterAttendeeDtTypeManual> params ', params);
  return adminAxiosInstance
    .post(
      `/api/pco/admin/total/top/attendee/attendee-payment-manual-status-change`,
      { attendeePaymentIdx, desiredStatus }
    )
    .then((response) => {
      // logger.debug('<getJoinAttendeeDt> response.data : ', response.data);
      return response.data;
    });
};

export const getRegistrationType = (): Promise<ResponseMessageVo<string[]>> => {
  return adminAxiosInstance
    .get(`/api/pco/admin/attendee/basic-plan`)
    .then((response) => {
      // logger.debug('<getRegistrationType> response.data : ', response.data);
      return response.data;
    });
};

/**
 * 탈퇴 제외 모든 회원 다운로드
 * @param date
 * @returns
 */
export const downloadAllUsers = (conferenceName: string, date: string) => {
  return adminAxiosInstance
    .get(`/api/pco/admin/attendee/excel`, {
      headers: {
        Accept:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
      responseType: 'blob',
    })
    .then((response) => {
      return response.data;
    }) // Receive the file as a Blob
    .then((blob) => {
      // Create a download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob); // Create an object URL for the Blob
      link.download = `${date}_${conferenceName}_회원목록`;
      link.click(); // Trigger the download
    })
    .catch((error) => {
      console.error('Error downloading file:', error);
    });
};
