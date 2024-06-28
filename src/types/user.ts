export interface User {
  accessToken?: string;
  refreshToken?: string;
  serviceType: string | undefined;
  wroleName: string;
  wuserIdx: number | null;
  phone?: string;
  email?: string;
  password?: string;
  status?: string;
  error?: string;

  // 학회의 경우
  conferenceIdx?: string;
}
