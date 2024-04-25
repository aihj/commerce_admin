export interface User {
  accessToken?: string;
  refreshToken?: string;

  serviceType: string;
  role: string;
  phone?: string;
  email?: string;
  password?: string;
  status?: string;

  // 학회의 경우
  conferenceIdx?: string;
}
