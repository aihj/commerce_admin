import axios from 'axios';

// 학회 기본 데이터 가져오기
export async function getPcoInfoForFirst(
  url?: string,
  confStringIdx?: string | null
) {
  // logger.debug(
  //   `<getPcoInfoForFirst> url : ${url} / confStringIdx : ${confStringIdx}`
  // );
  return axios.post(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/api/public/pco/pco-info`,
    { url, confStringIdx },
    {}
  );
}
