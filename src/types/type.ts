export interface Committee {
  committeeIdx: number;
  committeeName: string;
  committeeDesc: string;
  committeeContactNumber: string;
  committeeEmail: string;
  committeeAddr: string;
  committeeRegistrationT: Date;
  committeeCompanyRegiNumber: string; // 사업자 등록 번호
  isAvailable: number;
  isEnterprise: number;
}

export interface Conference {
  conferenceIdx: number;
  conferenceStringIdx: string;
  conferenceName: string;
  conferenceDesc: string;
  conferenceStartT: Date;
  conferenceEndT: Date;
  conferencePreRegiStartT: Date;
  conferencePreRegiEndT: Date;
  conferenceRegistrationT: Date;
  conferenceApplyType: 'pre' | 'onsite' | 'all' | 'n/a';
  essentialCredit: number;
  electiveCredit: number;
  isOnline: 0 | 1;
  homeUrl: string;
}

// 제휴일때만 사용하는 컬럼
export interface ConferenceAlliance {
  preUrl: string;
  cost: string;
  openContact: string;
  kmaCode: string;
  channelNewsIdx: string;
  conferenceApplyStatus: string;
}

export interface ConferenceEnterprise {
  conferenceEnterpriseIdx: string;
  conferenceIdx: string;
  stringIdx: string;
  needAppAuth: string;
  clientOpenStatus: string;
  adminOpenStatus: string;
  languageType: string;
  templateType: string;
}
