import axios, { AxiosInstance } from 'axios';
import { getSession, signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { logger } from '@/lib/logger/defaultLogger';

const adminAxiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BACKEND_URL,
  withCredentials: true,
  headers: {},
});

// API 요청을 보내기 직전에 새롭게 갱신한 accessToken값을 덮어씌우기
adminAxiosInstance.interceptors.request.use(
  async (config) => {
    const session = (await getSession()) as Session;

    // 리프레시 토큰 갱신 실패했을 경우 사용자 로그아웃
    if (session?.user?.error === 'refresh_token_update_failed') {
      await signOut();
    }
    // refreshToken후 새로운 값이 아닌 옛날값이 들어감
    config.headers.Authorization =
      config.headers.Authorization || `Bearer ${session.user.accessToken}`;
    if (session.user.conferenceIdx) {
      config.headers.conferenceIdx = `${session.user.conferenceIdx}`;
    }
    return config;
  },
  async (err) => {
    logger.error('axios response 실패 err : ', err);
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      // 임시 코드
      if (status === 400) {
        logger.error('데이터가 존재하지 않아요!');
      }
      if (status === 404) {
        logger.error('잘못된 값을 넣었어요!');
      }
    }
    return Promise.reject(err);
  }
);

// 리프레시 토큰 API SES
export function adminPostRefreshToken(
  accessToken: string,
  refreshToken: string,
  serviceType: string
) {
  return axios.post(
    `${process.env.NEXT_PUBLIC_AUTH_BACKEND_URL}/refresh_token`,
    {
      accessToken,
      refreshToken,
      serviceType,
    },
    {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    }
  );
}

// 응답을 보내고 나서 해야할 일 처리
adminAxiosInstance.interceptors.response.use(
  // 정상일 경우 그대로 응답 넘기기
  (response) => {
    // console.log('📍 adminAxiosInstance interceptors response : ', response);
    return response;
  },

  // 비정상일 경우
  async (error) => {
    const session = (await getSession()) as Session;
    const { config, response } = error;
    logger.error('[adminAxiosInstance.interceptors.response] error : ', error);
    logger.error(
      '[adminAxiosInstance.interceptors.response] response : ',
      response
    );
    if (error?.code === 'ERR_CANCELED' || error?.code === 'ERR_NETWORK')
      return Promise.reject(error);
    /* 만료된 토큰일경우 */
    if (response.status === 401) {
      // 토큰 만료시 로직은 next-auth에서 처리
      console.log('만료된 토큰입니다.');

      try {
        const response = await adminPostRefreshToken(
          session.user.accessToken,
          session.user.refreshToken,
          session.user.serviceType
        ).catch((error) => {
          console.error('response interceptors error : ', error);
          signOut();
          return Promise.reject(error); // not a 401, simply fail the response
        });

        if (response.status === 200) {
          console.log('리프레시 토큰 요청이 성공하였습니다.');

          if (response.data.content) {
            // 새로 받아온 accessToken 값 로컬 스토리에 덮어씌우기
            // session.user.accessToken = response.data.content.accessToken;
          } else {
            return Promise.reject(
              '리프레시 토큰 요청 응답 값이 잘못되었습니다.'
            );
          }
          // 진행중이던 요청 이어서하기(이것만으로 보내는 토큰 값이 변경 되지 않아 위의 request 인터셉터 추가)
          config.headers.Authorization = `Bearer ${response.data.content.accessToken}`;
          return adminAxiosInstance(config);
        }
        //리프레시 토큰 요청이 실패할때(리프레시 토큰도 만료되었을때 = 재로그인 안내)
        else {
          alert('잘못된 유저입니다. 다시 한번 로그인을 시도하세요.');
          await signOut();
        }
      } catch (error) {
        console.error('response interceptors error : ', error);
        await signOut();
      }
    }
    return Promise.reject(error); // not a 401, simply fail the response
  }
);

export { adminAxiosInstance };
