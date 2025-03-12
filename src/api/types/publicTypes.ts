export interface UserDuplicatedInfoRequest {
  conferenceIdx: number;
  email?: string;
  phone?: string;
  wserviceName?: string;
}

export interface GetPcoInfoForFirstRequest {
  conferenceIdx: number;
  conferenceStringIdx: string;
}
