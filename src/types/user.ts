export interface UserSession {
  accessToken?: string;
  serviceType: string | undefined;
  wroleNameList: {
    wroleName: string;
    wuserRoleStatus: string;
  }[];
  error?: string;
  conferenceIdx: number | null;
  wuserIdx: number | null;
  accessTokenExpires: string;
}

export interface User {
  serviceType: string | undefined;
  wuserStatus?: string;
  wuserIdx: number | null;
  wroleName: string;
  wuserRoleStatus: string;
}

// 직접 입력 문자보내기용 유저 인터페이스
export interface DirectUser {
  name: string;
  phone: string;
}

// 엑셀 업로드 문자보내기용 유저 인터페이스
export interface ExcelUploadedUser {
  index: number;
  name: string;
  phone: string;
  isValid: boolean;
}
