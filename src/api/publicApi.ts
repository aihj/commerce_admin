import axios from 'axios';
import { PcoBaseInfoVo } from '@/types/type';

// 학회 기본 데이터 가져오기
export const getPcoInfoForFirst = (
  url?: string,
  confStringIdx?: string | null
): Promise<PcoBaseInfoVo> => {
  return axios
    .post(
      `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/public/pco/pco-info`,
      { url, confStringIdx }
    )
    .then((result) => result.data.content);
};
