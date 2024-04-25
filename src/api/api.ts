// 학회 다중 옵션 중 타입별 개체 삭제
import { adminAxiosInstance } from '@/api/authApi';

export function removeTypeFromDB(
  confStringIdx: string,
  type: string,
  typeIdx: number
) {
  return adminAxiosInstance.delete(
    `/api/conference/${confStringIdx}/${type}/${typeIdx}`
    // { headers: adminAuthHeader() }
  );
}
