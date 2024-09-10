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

export const eachPcoLayoutConfig = (confStringIdx: string) => {
  return {
    navItems: [
      // TODO : 이모티콘 뭘로 할지 정하는건 필요함
      {
        key: 'EACH/PAYMENT',
        title: '대한미용학회',
        items: [
          {
            key: 'EACH/PAYMENT/B',
            title: '결제',
            icon: 'tent',
            items: [
              {
                key: 'EACH/PAYMENT/LIST',
                title: '결제 목록',
                href: PATH.EACH.PAYMENT.LIST(confStringIdx),
              },
              {
                key: 'EACH/PAYMENT/SETTING',
                title: '결제 설정',
                href: PATH.EACH.PAYMENT.SETTING(confStringIdx),
              },
            ],
          },
          {
            key: 'EACH/USER',
            title: '유저',
            icon: 'tent',
            items: [
              {
                key: 'EACH/USER/ATTENDEE',
                title: '회원 관리',
                icon: 'tent',
                items: [
                  {
                    key: 'EACH/USER/ATTENDEE/CREATE',
                    title: 'X 유저 생성 X',
                    href: PATH.EACH.USER.ATTENDEE.CREATE(confStringIdx),
                  },
                  {
                    key: 'EACH/USER/ATTENDEE/JOIN/LIST',
                    title: '가입 회원 목록',
                    href: PATH.EACH.USER.ATTENDEE.JOIN_LIST(confStringIdx),
                  },
                  {
                    key: 'EACH/USER/ATTENDEE/REGISTER/LIST',
                    title: '등록 회원 목록',
                    href: PATH.EACH.USER.ATTENDEE.REGISTER_LIST(confStringIdx),
                  },
                ],
              },
              {
                key: 'EACH/USER/FACULTY',
                title: '연자 관리',
                icon: 'tent',
                items: [
                  {
                    key: 'EACH/USER/FACULTY',
                    title: 'X 연자 생성 X',
                    href: PATH.EACH.USER.FACULTY.CREATE(confStringIdx),
                  },
                  {
                    key: 'EACH/USER/FACULTY/LIST',
                    title: 'X 연자 목록 X',
                    href: PATH.EACH.USER.FACULTY.LIST(confStringIdx),
                  },
                  {
                    // executives
                    key: 'EACH/USER/EXECUTIVES/LIST',
                    title: 'X 임원진 목록 X',
                    href: PATH.EACH.USER.EXECUTIVES.LIST(confStringIdx),
                  },
                ],
              },
            ],
          },
          {
            key: 'EACH/MESSAGE',
            title: '문자 & 이메일',
            icon: 'tent',
            items: [
              {
                key: 'EACH/MESSAGE/SMS',
                title: '문자 관리',
                icon: 'tent',
                items: [
                  {
                    key: 'EACH/MESSAGE/SMS/TEMPLATE',
                    title: '문자 양식 확인',
                    href: PATH.EACH.MESSAGE.SMS.TEMPLATE(confStringIdx),
                  },
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
              {
                key: 'EACH/MESSAGE/EMAIL',
                title: '이메일 관리',
                icon: 'tent',
                items: [
                  {
                    key: 'EACH/MESSAGE/EMAIL/TEMPLATE',
                    title: '이메일 양식 확인',
                    href: PATH.EACH.MESSAGE.EMAIL.TEMPLATE(confStringIdx),
                  },
                  {
                    key: 'EACH/MESSAGE/EMAIL/SEND',
                    title: '이메일 보내기',
                    href: PATH.EACH.MESSAGE.EMAIL.SEND(confStringIdx),
                  },
                  {
                    key: 'EACH/MESSAGE/EMAIL/LIST',
                    title: '이메일 리스트',
                    href: PATH.EACH.MESSAGE.EMAIL.LIST(confStringIdx),
                  },
                ],
              },
            ],
          },
          {
            key: 'EACH/PROGRAM/B',
            title: '프로그램',
            icon: 'tent',
            items: [
              {
                key: 'EACH/PROGRAM/LIST',
                title: '프로그램 목록',
                href: PATH.EACH.PROGRAM.LIST(confStringIdx),
              },
              {
                key: 'EACH/PROGRAM',
                title: '프로그램 생성하기',
                href: PATH.EACH.PROGRAM.CREATE(confStringIdx),
              },
              {
                key: 'EACH/PROGRAM/DETAIL',
                title: '프로그램 수정하기',
                href: PATH.EACH.PROGRAM.DETAIL(confStringIdx, 1),
              },
            ],
          },
          {
            key: 'EACH/TERMS',
            title: '약관',
            icon: 'tent',
            items: [
              {
                key: 'EACH/TERMS/TERMS_OF_USE',
                title: '이용약관',
                href: PATH.EACH.TERMS.TU(confStringIdx),
              },
              {
                key: 'EACH/TERMS/PRIVACY_POLICY',
                title: '개인정보 처리방침',
                href: PATH.EACH.TERMS.PP(confStringIdx),
              },
            ],
          },
          {
            key: 'EACH/GALLERY/B',
            title: '갤러리',
            icon: 'tent',
            items: [
              {
                key: 'EACH/GALLERY/LIST',
                title: '갤러리 보기',
                href: PATH.EACH.GALLERY.LIST(confStringIdx),
              },
              {
                key: 'EACH/GALLERY',
                title: '갤러리 추가하기',
                href: PATH.EACH.GALLERY.CREATE(confStringIdx),
              },
            ],
          },
          {
            key: 'EACH/NOTICE/B',
            title: '공지사항',
            icon: 'tent',
            items: [
              {
                key: 'EACH/NOTICE/LIST',
                title: '공지사항 보기',
                href: PATH.EACH.NOTICE.LIST(confStringIdx),
              },
              {
                key: 'EACH/NOTICE',
                title: '공지사항 추가하기',
                href: PATH.EACH.NOTICE.CREATE(confStringIdx),
              },
            ],
          },
          {
            key: 'EACH/ETC',
            title: '기타',
            icon: 'tent',
            items: [
              {
                key: 'EACH/ETC/HTML',
                title: 'HTML 에디터',
                icon: 'tent',
                items: [
                  {
                    key: 'EACH/ETC/HTML/GREETINGS',
                    title: '인사말',
                    href: PATH.EACH.ETC.HTML.GREETINGS(confStringIdx),
                  },
                  {
                    key: 'EACH/ETC/HTML/VENUE_INFORMATION',
                    title: '오시는 길',
                    href: PATH.EACH.ETC.HTML.VENUE_INFORMATION(confStringIdx),
                  },
                  {
                    key: 'EACH/ETC/HTML/CONSTITUTION',
                    title: '학회 회칙',
                    href: PATH.EACH.ETC.HTML.CONSTITUTION(confStringIdx),
                  },
                ],
              },
              {
                key: 'EACH/ETC/FOOTER',
                title: '푸터 관리',
                href: PATH.EACH.ETC.FOOTER(confStringIdx),
              },
              {
                key: 'EACH/ETC/MENU',
                title: '메뉴 관리',
                href: PATH.EACH.ETC.FOOTER(confStringIdx),
              },
            ],
          },
        ],
      },
    ],
  };
};
// }
