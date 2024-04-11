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
  EATH: {
    PROGRAM: {
      LIST: (confStringIdx: string) => `/${confStringIdx}/programs`,
      CREATE: (confStringIdx: string) => `/${confStringIdx}/programs/form`,
      DETAIL: (confStringIdx: string, programId: number) =>
        `/${confStringIdx}/programs/${programId}`,
    },
  },
  AUTH: {
    NEXT_AUTH: {
      LOGIN: '/auth/sign-in',
      REGISTER: '/auth/sign-up',
      RESET_PASSWORD: '/auth/set-password',
    },
  },
  SETTINGS: {
    MY_PAGE: '/settings/my-page',
  },
};
