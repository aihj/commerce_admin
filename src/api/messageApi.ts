import { logger } from '@/lib/logger/defaultLogger';
import { ResponseMessageVo } from './types/responseMessageVo';
import { adminAxiosInstance } from './authApi';
import { Filter } from '@/app/(afterLogin)/[confStringIdx]/message/sms/send/Filters';
import {
  LetterDtResponse,
  sendSMSFilteredUsersRequest,
  sendSMSTestRequest,
} from './types/messageTypes';
import { SMSListFiltersType } from '@/app/(afterLogin)/[confStringIdx]/message/sms/list/SMSListFilters';

/**
 * 문자 필터 선택 시 해당 총 회원수
 * @param Filter
 */
export const getTotalUserAmount = (
  searchParam: Filter
): Promise<ResponseMessageVo<any>> => {
  logger.debug('<getTotalUserAmount> params ', searchParam);
  return adminAxiosInstance
    .post(`/api/pco/admin/total/attendee/filter-count`, {
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
  logger.debug('<sendSMSFilteredUsers> params ', data);
  return adminAxiosInstance
    .post(`/api/pco/admin/total/top/attendee/message/filter`, {
      ...data,
    })
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
    .post(`/api/pco/admin/total/top/message/test`, {
      ...data,
    })
    .then((response) => {
      logger.debug('<sendSMSTest> response.data : ', response.data);
      return response.data;
    });
};

/**
 * 문자 발송 테스트
 * @param SMSListFiltersType
 * @returns
 */
export const getSMSList = (
  data: SMSListFiltersType
): Promise<ResponseMessageVo<LetterDtResponse[]>> => {
  logger.debug('<getSMSList> params ', data);
  return adminAxiosInstance
    .post(`/api/pco/admin/total/letter-dt`, {
      ...data,
    })
    .then((response) => {
      logger.debug('<getSMSList> response.data : ', response.data);
      return response.data;
    });
};
