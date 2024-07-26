// 학회 다중 옵션 중 타입별 개체 삭제
import { adminAxiosInstance } from '@/api/authApi';
import { HtmlSettingFormType } from '@/app/(afterLogin)/[confStringIdx]/etc/html/HtmlSettingFormType';
import { ResponseMessageVo } from '@/types/type';

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

// 해당 학회의 HTML 입력 및 수정
export const updateHtmlSetting = (
  data: HtmlSettingFormType
): Promise<ResponseMessageVo<null>> => {
  return adminAxiosInstance
    .post(`/api/pco/admin/total/html-setting`, data)
    .then((response) => {
      return response.data;
    });
};
