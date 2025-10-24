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
  TOTAL: {
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
      // APP_REGISTER: {
      //   LIST: '/total/conference/app-register/list',
      //   VIEW: (conferenceIdx: number) =>
      //     `/total/conference/app-register/view/${conferenceIdx}`,
      // },
      // ORDER: {
      //   LIST: '/total/conference/order/list',
      //   VIEW: (conferenceIdx: number) =>
      //     `/total/conference/order/view/${conferenceIdx}`,
      // },
    },

    PRODUCT: {
      LIST: '/total/product/list',
      VIEW: (productIdx: number) => `/total/product/view/${productIdx}`,
    },

    ORDER: {
      LIST: '/total/order/list',
      VIEW: (orderIdx: number) => `/total/order/view/${orderIdx}`,
    },
  },
  // 각 학회마다 경로가 다를 경우
  EACH: {
    MAIN: (confStringIdx: string) => `/${confStringIdx}`,
    CONFERENCE: {
      DETAIL: (confStringIdx: string) => `/${confStringIdx}/detail`,
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
      EXECUTIVES: {
        CREATE: (confStringIdx: string) => `/${confStringIdx}/user/executives`,
        MODIFY: (confStringIdx: string, facultyIdx: number) =>
          `/${confStringIdx}/user/executives/${facultyIdx}`,
        LIST: (confStringIdx: string) =>
          `/${confStringIdx}/user/executives/list`,
      },
    },
    PROGRAM: {
      // CREATE: (confStringIdx: string) => `/${confStringIdx}/program`,
      // LIST: (confStringIdx: string) => `/${confStringIdx}/program/list`,
      // DETAIL: (confStringIdx: string, programId: number) =>
      //   `/${confStringIdx}/program/${programId}`,
      // SESSION_GROUP: {
      //   DETAIL: (confStringIdx: string, programId: number) =>
      //     `/${confStringIdx}/program/session-groups/${programId}`,
      // },
      INDEX: (confStringIdx: string) => `/${confStringIdx}/program`,
    },
    // FACULTY: {
    //   CREATE: (confStringIdx: string) => `/${confStringIdx}/user/faculty`,
    //   MODIFY: (confStringIdx: string, facultyIdx: number) =>
    //     `/${confStringIdx}/user/faculty/${facultyIdx}`,
    //   LIST: (confStringIdx: string) => `/${confStringIdx}/user/faculty/list`,
    // },
    PAYMENT: {
      LIST: (confStringIdx: string) => `/${confStringIdx}/payment/list`,
      SETTING: (confStringIdx: string) => `/${confStringIdx}/payment/setting`,
    },
    MESSAGE: {
      SMS: {
        TEMPLATE: (confStringIdx: string) =>
          `/${confStringIdx}/message/sms/template`,
        SEND: (confStringIdx: string) => `/${confStringIdx}/message/sms/send`,
        LIST: (confStringIdx: string) => `/${confStringIdx}/message/sms/list`,
        DETAIL: (confStringIdx: string, letterIdx: number) =>
          `/${confStringIdx}/message/sms/list/${letterIdx}`,
      },
      EMAIL: {
        TEMPLATE: (confStringIdx: string) =>
          `/${confStringIdx}/message/email/template`,
        SEND: (confStringIdx: string) => `/${confStringIdx}/message/email/send`,
        LIST: (confStringIdx: string) => `/${confStringIdx}/message/email/list`,
      },
    },
    FACULTY: {
      LIST: (confStringIdx: string) => `/${confStringIdx}/faculty`,
      ADD: (confStringIdx: string) => `/${confStringIdx}/faculty/add`,
      DETAIL: (confStringIdx: string, facultyIdx: string) =>
        `/${confStringIdx}/faculty/${facultyIdx}`,
      EDIT: (confStringIdx: string, facultyIdx: number) =>
        `/${confStringIdx}/faculty/${facultyIdx}/edit`,
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
      HTML: {
        GREETINGS: (confStringIdx: string) =>
          `/${confStringIdx}/etc/html/greetings`, // 인사말
        VENUE_INFORMATION: (confStringIdx: string) =>
          `/${confStringIdx}/etc/html/venue-information`, // 오시는 길
        CONSTITUTION: (confStringIdx: string) =>
          `/${confStringIdx}/etc/html/constitution`, // 학회 회칙
      },

      FOOTER: (confStringIdx: string) => `/${confStringIdx}/etc/footer`,
      MENU: (confStringIdx: string) => `/${confStringIdx}/etc/menu`,
    },
  },
  SETTING: {
    MY_PAGE: '/setting/my-page',
  },
};
