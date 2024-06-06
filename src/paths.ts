export const PATH = {
  TEST: '/test',
  // dashboard
  HOME: '/',
  COMMITTEE: {
    LIST: '/committees',
    CREATE: '/committees/form',
    DETAIL: (invoiceId: number) => `/committees/${invoiceId}`,
  },
  CONFERENCE: {
    ENTERPRISE: {
      LIST: '/enterprise-conferences',
      CREATE: '/enterprise-conferences/from',
      DETAIL: (invoiceId: number) => `/enterprise-conferences/${invoiceId}`,
    },
    ALLIANCE: {
      LIST: '/alliance-conferences',
      CREATE: '/alliance-conferences/form',
      DETAIL: (invoiceId: number) => `/alliance-conferences/${invoiceId}`,
    },
  },

  // 각 학회마다 경로가 다를 경우
  EACH: {
    CONFERENCE: {
      DETAIL: (confStringIdx: string) => `/${confStringIdx}`,
    },
    PROGRAM: {
      LIST: (confStringIdx: string) => `/${confStringIdx}/programs`,
      CREATE: (confStringIdx: string) => `/${confStringIdx}/programs/form`,
      DETAIL: (confStringIdx: string, programId: number) =>
        `/${confStringIdx}/programs/${programId}`,
      SESSION_GROUP: {
        DETAIL: (confStringIdx: string, programId: number) =>
          `/${confStringIdx}/program/session-groups/${programId}`,
      },
    },
    SETTING: {
      EDITOR: (confStringIdx: string) =>
        `/${confStringIdx}/setting/html-editor`,
      FILE: (confStringIdx: string) => `/${confStringIdx}/setting/file`,
    },
  },
  AUTH: {
    NEXT_AUTH: {
      LOGIN: '/auth/sign-in',
      REGISTER: '/auth/sign-up',
      RESET_PASSWORD: '/auth/set-password',
    },
  },
  SETTING: {
    MY_PAGE: '/setting/my-page',
  },
};
