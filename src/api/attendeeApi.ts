import { adminAxiosInstance } from '@/api/authApi';
import {
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
    .post(`/api/pco/admin/all/join-attendee-dt`, params)
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
    .post(`/api/pco/admin/all/register-attendee-dt`, params)
    .then((response) => {
      logger.debug('<getJoinAttendeeDt> response.data : ', response.data);
      return response.data;
    });
};
