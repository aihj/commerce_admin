import { adminAxiosInstance } from '@/api/authApi';
import { JoinAttendeeDtVo } from '@/api/types/attendeeTypes';
import { TableSearchParams } from '@/api/types/tableSearchParams';
import { ResponseMessageVo } from '@/types/type';
import { logger } from '@/lib/logger/defaultLogger';

/**
 * 가입 회원 리스트 가져오기
 * @param wuserIdx
 * @return regifeeIdx, wuserIdx
 */
export const getJoinAttendeeDt = (
  params: TableSearchParams
): Promise<ResponseMessageVo<JoinAttendeeDtVo>> => {
  logger.debug('<getJoinAttendeeDt> params ', params);
  return adminAxiosInstance
    .post(`/api/pco/admin/all/join-attendee-dt`, params)
    .then((response) => {
      logger.debug('<getJoinAttendeeDt> response.data : ', response.data);
      return response.data;
    });
};
