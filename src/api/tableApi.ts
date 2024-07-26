import { ResponseMessageVo } from '@/types/type';
import { adminAxiosInstance } from '@/api/authApi';

export const getJoinAttendeeDt = <T extends object>(
  searchParam: T
): Promise<ResponseMessageVo<null>> => {
  return adminAxiosInstance
    .post(`/api/pco/admin/join-attendee-dt`, searchParam)
    .then((response) => {
      return response.data;
    });
};
