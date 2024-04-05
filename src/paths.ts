export const PATH = {
  // dashboard
  HOME: '/',
  COMMITTEE: {
    LIST: '/committees',
    CREATE: '/committee',
    DETAIL: (invoiceId: number) => `/committee/${invoiceId}`,
  },
  CONFERENCE: {
    LIST: '/conferences',
    CREATE: '/conference',
    DETAIL: (invoiceId: number) => `/conference/${invoiceId}`,
  },

  // 각 학회마다 경로가 다를 경우
  EATH: {
    PROGRAM: {
      LIST: (confStringIdx: string) => `/${confStringIdx}/programs`,
      CREATE: (confStringIdx: string) => `/${confStringIdx}/program`,
      DETAIL: (confStringIdx: string, programId: number) =>
        `/${confStringIdx}/program/${programId}`,
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
