import axios, { AxiosInstance } from 'axios';
import { getSession } from 'next-auth/react';

const adminAxiosTest: AxiosInstance = axios.create({
  baseURL: 'https://webapptest.medistaff.co.kr/',
  // baseURL: 'http://localhost:8055/',
  withCredentials: false, // 쿠키 안 쓸 거면 false
  headers: {
    //Authorization: `Bearer ${STATIC_TEST_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

const adminAxiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BACKEND_URL,
  withCredentials: true,
  headers: {},
});

adminAxiosTest.interceptors.request.use(async (config) => {
  (config.headers as any).Accept = (config.headers as any).Accept ?? '*/*';

  const isAdmin = (url?: string) => {
    if (!url) return false;
    const path = url.startsWith('http') ? new URL(url).pathname : url;
    return path.startsWith('/api/admin/');
  };

  if (isAdmin(config.url)) {
    // per-call Authorization 이미 있으면 유지
    if (!(config.headers as any).Authorization) {
      const session = await getSession();
      const token = (session as any)?.user?.accessToken;
      console.log('[admin] sending token?', !!token, token?.slice(0, 20)); // ⬅︎ 확인용
      if (token) (config.headers as any).Authorization = `Bearer ${token}`;
    }
    (config.headers as any).wserviceName =
      (config.headers as any).wserviceName ?? 'medistaff_admin';
  } else {
    delete (config.headers as any).Authorization;
    delete (config.headers as any).wserviceName;
  }

  return config;
});

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
// const refreshClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8055',
//   timeout: 10000,
// });

export { adminAxiosTest, adminAxiosInstance };
