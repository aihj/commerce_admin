export const PATH = {
  AUTH: {
    NEXT_AUTH: {
      LOGIN: '/auth/sign-in',
      REGISTER: '/auth/sign-up',
      RESET_PASSWORD: '/auth/set-password',
    },
  },
  TEST: '/test',
  // dashboard
  HOME: '/',
  MEDI: {
    MANAGER: {
      LIST: '/manager/list',
      CREATE: '/manager',
      DETAIL: (managerId: number) => `/manager/${managerId}`,
    },
    COMMITTEE: {
      LIST: '/committee/list',
      CREATE: '/committee',
      DETAIL: (committeeId: number) => `/committee/${committeeId}`,
    },
    CONFERENCE: {
      ENTERPRISE: {
        LIST: '/enterprise-conferences',
        CREATE: '/enterprise-conferences/from',
        MODIFY: (invoiceId: number) => `/enterprise-conferences/${invoiceId}`,
      },
      ALLIANCE: {
        LIST: '/alliance-conferences',
        CREATE: '/alliance-conferences/form',
        MODIFY: (invoiceId: number) => `/alliance-conferences/${invoiceId}`,
      },
    },
  },
  // 각 학회마다 경로가 다를 경우
  EACH: {
    MAIN: (confStringIdx: string) => `/${confStringIdx}`,
    CONFERENCE: {
      DETAIL: (confStringIdx: string) => `/${confStringIdx}/detail`,
    },
    PROGRAM: {
      CREATE: (confStringIdx: string) => `/${confStringIdx}/program`,
      LIST: (confStringIdx: string) => `/${confStringIdx}/program/list`,
      DETAIL: (confStringIdx: string, programId: number) =>
        `/${confStringIdx}/program/${programId}`,
      SESSION_GROUP: {
        DETAIL: (confStringIdx: string, programId: number) =>
          `/${confStringIdx}/program/session-groups/${programId}`,
      },
    },
    USER: {
      ATTENDEE: {
        JOIN_LIST: (confStringIdx: string) =>
          `/${confStringIdx}/user/attendee/join/list`,
        REGISTER_LIST: (confStringIdx: string) =>
          `/${confStringIdx}/user/attendee/register/list`,
        CREATE: (confStringIdx: string) => `/${confStringIdx}/user/attendee`,
        DETAIL: (confStringIdx: string, attendeeIdx: number) =>
          `/${confStringIdx}/user/attendee/${attendeeIdx}`,
      },
      FACULTY: {
        CREATE: (confStringIdx: string) => `/${confStringIdx}/user/faculty`,
        MODIFY: (confStringIdx: string, facultyIdx: number) =>
          `/${confStringIdx}/user/faculty/${facultyIdx}`,
        LIST: (confStringIdx: string) => `/${confStringIdx}/user/faculty/list`,
      },
      EXECUTIVES: {
        CREATE: (confStringIdx: string) => `/${confStringIdx}/user/executives`,
        MODIFY: (confStringIdx: string, facultyIdx: number) =>
          `/${confStringIdx}/user/executives/${facultyIdx}`,
        LIST: (confStringIdx: string) =>
          `/${confStringIdx}/user/executives/list`,
      },
    },
    PAYMENT: {
      LIST: (confStringIdx: string) => `/${confStringIdx}/payment/list`,
      SETTING: (confStringIdx: string) => `/${confStringIdx}/payment/setting`,
    },
    ME: {
      MESSAGE: {
        TEMPLATE: (confStringIdx: string) =>
          `/${confStringIdx}/me/message/template`,
        SEND: (confStringIdx: string) => `/${confStringIdx}/me/message/send`,
        LIST: (confStringIdx: string) => `/${confStringIdx}/me/message/list`,
      },
      EMAIL: {
        TEMPLATE: (confStringIdx: string) =>
          `/${confStringIdx}/me/email/template`,
        SEND: (confStringIdx: string) => `/${confStringIdx}/me/email/send`,
        LIST: (confStringIdx: string) => `/${confStringIdx}/me/email/list`,
      },
    },
    GALLERY: {
      LIST: (confStringIdx: string) => `/${confStringIdx}/terms/terms-of-use`,
      CREATE: (confStringIdx: string) =>
        `/${confStringIdx}/terms/privacy-policy`,
      MODIFY: (confStringIdx: string) =>
        `/${confStringIdx}/terms/privacy-policy`,
    },
    NOTICE: {
      CREATE: (confStringIdx: string) => `/${confStringIdx}/notice`,
      MODIFY: (confStringIdx: string, noticeIdx: number) =>
        `/${confStringIdx}/notice/${noticeIdx}`,
      LIST: (confStringIdx: string) => `/${confStringIdx}/notice/list`,
    },
    TERMS: {
      TU: (confStringIdx: string) => `/${confStringIdx}/terms/terms-of-use`,
      PP: (confStringIdx: string) => `/${confStringIdx}/terms/privacy-policy`,
    },
    ETC: {
      GREETINGS: (confStringIdx: string) => `/${confStringIdx}/etc/greetings`,
      VENUE_INFORMATION: (confStringIdx: string) =>
        `/${confStringIdx}/etc/venue-information`,
      CONSTITUTION: (confStringIdx: string) =>
        `/${confStringIdx}/etc/constitution`,
      FOOTER: (confStringIdx: string) => `/${confStringIdx}/etc/footer`,
      MENU: (confStringIdx: string) => `/${confStringIdx}/etc/menu`,
    },
  },
  SETTING: {
    MY_PAGE: '/setting/my-page',
  },
};
