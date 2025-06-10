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
                key: 'TOTAL/CONFERENCE/APP_REGISTER/LIST',
                title: '학회 강좌 목록',
                icon: 'tent',
                href: PATH.TOTAL.CONFERENCE.APP_REGISTER.LIST,
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
