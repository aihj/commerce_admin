import { PATH } from '@/paths';
import type { NavItemConfig } from '@/types/nav';
export interface LayoutConfig {
  navItems: NavItemConfig[];
}

// TODO: 권한마다 보여주는 레이아웃을 다르게 할려면 어떻게 해야할까?
// TODO : 생각해보니 권한마다가 아니라 경로마다임 confStringIdx를 포함할경우에는
// TODO : 이모티콘 뭘로 할지 정하는건 필요함
// export class MenuConfig {
//   readonly confStringIdx: string;
//   constructor(confStringIdx) {
//     confStringIdx = confStringIdx;
//   }
export const layoutConfig = () => {
  return {
    navItems: [
      {
        key: 'MEDI/PCO',
        title: '최고 관리자',
        items: [
          {
            key: 'MEDI/PCO',
            title: '학회 관리',
            icon: 'tent',
            items: [
              {
                key: 'MEDI/COMMITTEE/B',
                title: '사무국',
                icon: 'tent',
                items: [
                  {
                    key: 'MEDI/COMMITTEE',
                    title: '사무국 생성하기',
                    href: PATH.MEDI.COMMITTEE.CREATE,
                    auth: '',
                  },
                ],
              },
              {
                key: 'MEDI/CONFERENCE/ENTERPRISE/B',
                title: 'Enterprise 학회',
                icon: 'users',
                items: [
                  {
                    key: 'MEDI/CONFERENCE/ENTERPRISE',
                    title: 'Enterprise 학회 생성',
                    href: PATH.MEDI.CONFERENCE.ENTERPRISE.CREATE,
                  },
                  {
                    key: 'MEDI/CONFERENCE/ENTERPRISE/LIST',
                    title: 'Enterprise 학회 목록',
                    href: PATH.MEDI.CONFERENCE.ENTERPRISE.LIST,
                  },
                ],
              },
              {
                key: 'MEDI/CONFERENCE/ALLIANCE/B',
                title: 'Alliance 학회',
                icon: 'users',
                items: [
                  {
                    key: 'MEDI/CONFERENCE/ALLIANCE',
                    title: 'Alliance 학회 생성',
                    href: PATH.MEDI.CONFERENCE.ALLIANCE.CREATE,
                  },
                  {
                    key: 'MEDI/CONFERENCE/ALLIANCE/LIST',
                    title: 'Alliance 학회 목록',
                    href: PATH.MEDI.CONFERENCE.ALLIANCE.LIST,
                  },
                ],
              },
            ],
          },
          {
            key: 'MEDI/MANAGER',
            title: '관리자',
            icon: 'tent',
            items: [
              {
                key: 'MEDI/MANAGER',
                title: '관리자',
                icon: 'tent',
                items: [
                  {
                    key: 'MEDI/MANAGER',
                    title: '관리자 생성하기',
                    href: PATH.MEDI.MANAGER.CREATE,
                  },
                  {
                    key: 'MEDI/MANAGER/CREATE',
                    title: '관리자 목록',
                    href: PATH.MEDI.MANAGER.LIST,
                  },
                ],
              },
              {
                key: 'MEDI/ETC',
                title: '기타',
                icon: 'tent',
                items: [
                  {
                    key: 'MEDI/ETC/MENU',
                    title: '메뉴 아이템 관리',
                    href: PATH.MEDI.MANAGER.CREATE,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
};

export const eachPcoLayoutConfig = (
  confStringIdx: string,
  conferenceName: string
) => {
  return {
    navItems: [
      {
        key: 'EACH/PAYMENT',
        title: conferenceName,
        items: [
          {
            key: 'EACH/USER/ATTENDEE',
            title: '참가자',
            icon: 'tent',
            items: [
              {
                key: 'EACH/USER/ATTENDEE/JOIN/LIST',
                title: '가입자 목록',
                href: PATH.EACH.USER.ATTENDEE.JOIN_LIST(confStringIdx),
              },
              {
                key: 'EACH/USER/ATTENDEE/REGISTER/LIST',
                title: '등록자 목록',
                href: PATH.EACH.USER.ATTENDEE.REGISTER_LIST(confStringIdx),
              },
            ],
          },
          {
            key: 'EACH/MESSAGE/SMS',
            title: '문자 관리',
            icon: 'tent',
            items: [
              // {
              //   key: 'EACH/MESSAGE/SMS/TEMPLATE',
              //   title: '문자 양식 확인',
              //   href: PATH.EACH.MESSAGE.SMS.TEMPLATE(confStringIdx),
              // },
              {
                key: 'EACH/MESSAGE/SMS/SEND',
                title: '문자 보내기',
                href: PATH.EACH.MESSAGE.SMS.SEND(confStringIdx),
              },
              {
                key: 'EACH/MESSAGE/SMS/LIST',
                title: '문자 발송 목록',
                href: PATH.EACH.MESSAGE.SMS.LIST(confStringIdx),
              },
            ],
          },
        ],
      },
    ],
  };
};
