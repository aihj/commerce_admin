import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getSession } from 'next-auth/react';

interface APIResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

interface CustomInstance extends AxiosInstance {
  get<T = unknown, R = AxiosResponse<APIResponse<T>>, D = unknown>(
    url: string,
    config?: AxiosRequestConfig<D>
  ): Promise<R>;

  /*
  	이외에도 post, put, patch, delete를 작성하여 정리할 수 있다.
    특히 post, put, patch와 같이 헤더에 데이터를 담아 보내는 메소드의 경우
    get, delete와 다르게 url, config, 그리고 data 객체까지 설정해줘야 한다.
  */
}

const adminAxiosInstance: CustomInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BACKEND_URL,
  withCredentials: true,
  headers: {},
});

// API 요청을 보내기 직전에 새롭게 갱신한 accessToken값을 덮어씌우기
adminAxiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    // console.log(
    //   '📍 adminAxiosInstance interceptors request session -> ',
    //   session
    // );
    // console.log(
    //   '📍 adminAxiosInstance interceptors request config -> ',
    //   config
    // );
    config.headers.Authorization = `Bearer ${session.user.accessToken}`;
    config.headers['Auth-Type'] = process.env.NEXT_PUBLIC_AUTH_TYPE;
    return config;
  },
  async (err) => {
    console.log('axios response 실패 err : ', err);
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      // 임시 코드
      if (status === 400) {
        console.log('데이터가 존재하지 않아요!');
      }
      if (status === 404) {
        console.log('잘못된 값을 넣었어요!');
      }
    }
    return Promise.reject(err);
  }
);

// 리프레시 토큰 API
async function adminPostRefreshToken() {
  const user = getSession().user;
  return await adminAxiosInstance.post(
    `/api/token`,
    {
      mediAdminRefreshToken: user.refreshToken,
    },
    {
      headers: {
        Authorization: 'Bearer ' + user.accessToken,
        'Auth-type': process.env.NEXT_PUBLIC_AUTH_TYPE,
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
    const {
      config,
      response: { status },
    } = error;
    const session = await getSession();
    if (status === 401) {
      // 401에러 이면서 Unauthorized에러가 발생할 경우 리프레스 토큰으로 access token 값 갱신하기
      if (error.response.data.message === 'Unauthorized') {
        console.log('토큰이 만료되어 401에러를 받습니다.');

        const originRequest = config; // 기존 요청 값

        //리프레시 토큰 api
        const response = await adminPostRefreshToken();

        //리프레시 토큰 요청이 성공할 때
        if (response.status === 200) {
          console.log('리프레시 토큰 요청이 성공하였습니다.');

          if (response.data.content) {
            // 새로 받아온 accessToken 값 로컬 스토리에 덮어씌우기
            session.user.refreshToken = response.data.content.accessToken;
          } else {
            return Promise.reject(
              '리프레시 토큰 요청 응답 값이 잘못되었습니다.'
            );
          }
          // 진행중이던 요청 이어서하기(이것만으로 보내는 토큰 값이 변경 되지 않아 위의 request 인터셉터 추가)
          originRequest.headers.Authorization = `Bearer ${response.data.content.accessToken}`;
          return adminAxiosInstance(originRequest);
        }

        //리프레시 토큰 요청이 실패할때(리프레시 토큰도 만료되었을때 = 재로그인 안내)
        else if (response.status === 404) {
          alert('잘못된 유저입니다. 다시 한번 로그인을 시도하세요.');
          window.location.replace('/admin');
        } else {
          alert('response.status : ${response.status}');
        }
      }
    }
    return Promise.reject(error); // not a 401, simply fail the response
  }
);

export { adminAxiosInstance };
