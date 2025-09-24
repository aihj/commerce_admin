import { logger } from '@/lib/logger/defaultLogger';
import { ResponseMessageVo } from './types/responseMessageVo';
import { adminAxiosInstance } from './authApi';
import { Filter } from '@/app/(afterLogin)/[confStringIdx]/message/sms/send/Filters';
import {
  LetterDtResponse,
  resendFailedUserRequest,
  getSMSDetailRequest,
  getSMSDetailResponse,
  sendSMSFilteredUsersRequest,
  sendSMSTestRequest,
  getUsersWithNameOrPhoneRequest,
  getUsersWithNameOrPhoneResponse,
  sendSMSSelectedUsersRequest,
  sendSMSDirectlyAddedUsersRequest,
  getSendersResponse,
} from './types/messageTypes';
import { SMSListFiltersType } from '@/app/(afterLogin)/[confStringIdx]/message/sms/list/SMSListFilters';
import { dateFormat } from '@/lib/dayjs';
import axios from 'axios';

/**
 * 문자 필터 선택 시 해당 총 회원수
 * @param Filter
 */
export const getTotalUserAmount = (
  searchParam: Filter
): Promise<ResponseMessageVo<any>> => {
  logger.debug('<getTotalUserAmount> params ', searchParam);
  return adminAxiosInstance
    .post(`/api/pco/admin/message/attendee/filtered-count`, {
      searchParam,
    })
    .then((response) => {
      logger.debug('<getTotalUserAmount> response.data : ', response.data);
      return response.data;
    });
};

/**
 * 필터된 사용자에게 문자 발송
 * @param sendSMSFilteredUsersRequest
 * @returns
 */
export const sendSMSFilteredUsers = (
  data: sendSMSFilteredUsersRequest
): Promise<ResponseMessageVo<any>> => {
  logger.debug('<sendSMSFilteredUsers> params ', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return adminAxiosInstance
    .post(
      `/api/pco/admin/total/top/message/attendee/send-filtered`,
      {
        ...data,
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    .then((response) => {
      logger.debug('<sendSMSFilteredUsers> response.data : ', response.data);
      return response.data;
    });
};

/**
 * 문자 발송 테스트
 * @param sendSMSTestRequest
 * @returns
 */
export const sendSMSTest = (
  data: sendSMSTestRequest
): Promise<ResponseMessageVo<any>> => {
  logger.debug('<sendSMSTest> params ', data);
  return adminAxiosInstance
    .post(
      `/api/pco/admin/total/top/message/attendee/send-test`,
      {
        ...data,
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    .then((response) => {
      logger.debug('<sendSMSTest> response.data : ', response.data);
      return response.data;
    });
};

/**
 * 문자 발송 내역
 * @param SMSListFiltersType
 * @returns
 */
export const getSMSList = (
  data: SMSListFiltersType
): Promise<ResponseMessageVo<LetterDtResponse[]>> => {
  logger.debug('<getSMSList> params ', data);
  return adminAxiosInstance
    .post(`/api/pco/admin/total/middle/message/letters`, {
      ...data,
    })
    .then((response) => {
      logger.debug('<getSMSList> response.data : ', response.data);
      return response.data;
    });
};

/**
 * 문자 보낸 내역 아이템 리스트
 * @param Filter
 */
export const getSMSDetail = (
  searchParam: getSMSDetailRequest
): Promise<ResponseMessageVo<getSMSDetailResponse>> => {
  logger.debug('<getSMSDetail> params ', searchParam);
  return adminAxiosInstance
    .post(`/api/pco/admin/total/middle/message/letter-items`, {
      ...searchParam,
    })
    .then((response) => {
      logger.debug('<getSMSDetail> response.data : ', response.data);
      return response.data;
    });
};

/**
 * 문자 발송 실패 전체 재발송
 * @param resendFailedUserRequest
 * @returns
 */
export const resendFailedUser = (data: resendFailedUserRequest) => {
  logger.debug('<resendFailedUser> params ', data);
  return adminAxiosInstance
    .post(`/api/pco/admin/total/top/message/resend`, {
      ...data,
    })
    .then((response) => {
      logger.debug('<resendFailedUser> response.data : ', response.data);
      return response.data;
    });
};

/**
 * 이름 혹은 전화번호로 회원 검색
 * @param getUsersWithNameOrPhoneRequest
 * @returns getUsersWithNameOrPhoneResponse
 */
export const getUsersWithNameOrPhone = (
  data: getUsersWithNameOrPhoneRequest
): Promise<ResponseMessageVo<getUsersWithNameOrPhoneResponse[]>> => {
  logger.debug('<getUsersWithNameOrPhone> params ', data);
  return adminAxiosInstance
    .post(`/api/pco/admin/total/find-users`, {
      ...data,
    })
    .then((response) => {
      logger.debug('<getUsersWithNameOrPhone> response.data : ', response.data);
      return response.data;
    });
};

/**
 * 선택된 사용자에게 문자 발송
 * @param sendSMSSelectedUsersRequest
 * @returns
 */
export const sendSMSSelectedUsers = (
  data: sendSMSSelectedUsersRequest
): Promise<ResponseMessageVo<any>> => {
  logger.debug('<sendSMSSelectedUsers> params ', data);
  return adminAxiosInstance
    .post(
      `/api/pco/admin/total/top/message/attendee/send-selected`,
      {
        ...data,
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    .then((response) => {
      logger.debug('<sendSMSSelectedUsers> response.data : ', response.data);
      return response.data;
    });
};

/**
 * 직접 추가한 대상에게 문자 전송
 * @param sendSMSDirectlyAddedUsersRequest
 * @returns
 */
export const sendSMSDirectlyAddedUsers = (
  data: sendSMSDirectlyAddedUsersRequest
): Promise<ResponseMessageVo<any>> => {
  logger.debug('<sendSMSDirectlyAddedUsers> params ', data);
  return adminAxiosInstance
    .post(
      `/api/pco/admin/total/top/message/send-manual`,
      {
        ...data,
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    .then((response) => {
      logger.debug(
        '<sendSMSDirectlyAddedUsers> response.data : ',
        response.data
      );
      return response.data;
    });
};

/**
 * 문자 발송 내역 상세페이지에서 전송결과 엑셀다운로드
 * @param letterIdx
 * @returns
 */
export const downloadSendedUsers = (
  letterIdx: string,
  completeDate: string
) => {
  return adminAxiosInstance
    .get(`/api/pco/admin/total/middle/message/${letterIdx}/excel-download`, {
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
      console.log(blob);
      // Create a download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob); // Create an object URL for the Blob
      link.download = `문자전송결과_${letterIdx}_${dateFormat(completeDate, 'YYMMDD')}`;
      link.click(); // Trigger the download
    })
    .catch((error) => {
      console.error('Error downloading file:', error);
    });
};

/**
 * 문자 발송 중일때, 즉시 발동 중단
 * @param letterIdx
 * @returns
 */
export const stopSendingMessage = (
  letterIdx: string
): Promise<ResponseMessageVo<null>> => {
  logger.debug('<stopSendingMessage> params ', letterIdx);
  return adminAxiosInstance
    .get(`/api/pco/admin/total/top/message/${letterIdx}/stop`)
    .then((response) => {
      logger.debug('<stopSendingMessage> response.data : ', response.data);
      return response.data;
    });
};

/**
 * 엑셀 업로드 대상에게 문자 전송
 * @param sendSMSDirectlyAddedUsersRequest
 * @returns
 */
export const sendSMSExcelUploadedUsers = (
  data: sendSMSDirectlyAddedUsersRequest
): Promise<ResponseMessageVo<any>> => {
  logger.debug('<sendSMSExcelUploadedUsers> params ', data);
  return adminAxiosInstance
    .post(
      `/api/pco/admin/total/top/message/send-excel`,
      {
        ...data,
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    .then((response) => {
      logger.debug(
        '<sendSMSExcelUploadedUsers> response.data : ',
        response.data
      );
      return response.data;
    });
};

/**
 * 학회 별 10분이내 이미 발송한 문자건이 있는지 확인
 * @param conferenceIdx
 * @returns
 */
export const getSMSLastSendedTime = (
  conferenceIdx: number
): Promise<ResponseMessageVo<any>> => {
  return adminAxiosInstance
    .get(`/api/pco/admin/total/top/${conferenceIdx}/message/last-send-time`)
    .then((response) => {
      logger.debug('<getSMSLastSendedTime> response.data : ', response.data);
      return response.data;
    });
};

/**
 * 문자보내기 발신 가능 번호 조회
 * @returns
 */
export const getSenders = (): Promise<
  ResponseMessageVo<getSendersResponse[]>
> => {
  return axios
    .get(
      `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/public/wservice/1/company-contact-number`
    )
    .then((response) => {
      logger.debug('<getSenders> response.data : ', response.data);
      return response.data;
    });
};

/**
 * 문자 상세 > 예약 발송이고 발송 시작 전일때 예약 취소
 * @param letterIdx
 * @returns
 */
export const cancelScheduledSend = (
  letterIdx: string
): Promise<ResponseMessageVo<null>> => {
  return adminAxiosInstance
    .get(
      `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/pco/admin/total/top/message/${letterIdx}/schedule-stop`
    )
    .then((response) => {
      logger.debug('<cancelScheduledSend> response.data : ', response.data);
      return response.data;
    });
};
