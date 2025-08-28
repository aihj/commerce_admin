export interface UserSession {
  accessToken: string;
  refreshToken: string;
  serviceType: string;
  wroleNameList: {
    wroleName: string;
    wuserRoleStatus: string;
    conferenceIdx: number | null;
    conferenceStringIdx: string | null;
  }[];
  error?: string;
  conferenceIdx: number | null;
  wuserIdx: number | null;
  wuserStatus?: string;
  accessTokenExpires: string;
}

export interface User {
  serviceType: string | undefined;
  wuserStatus?: string;
  wuserIdx: number | null;
  wroleNameList: {
    wroleName: string;
    wuserRoleStatus: string;
    conferenceIdx: number | null;
    conferenceStringIdx: string | null;
  }[];
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
