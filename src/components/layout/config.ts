import { PATH } from '@/paths';
import type { NavItemConfig } from '@/types/nav';
export interface LayoutConfig {
  navItems: NavItemConfig[];
}

// TODO: 권한마다 보여주는 레이아웃을 다르게 할려면 어떻게 해야할까?
// TODO : 생각해보니 권한마다가 아니라 경로마다임 confStringIdx를 포함할경우에는
// TODO : 이모티콘 뭘로 할지 정하는건 필요함
const layoutConfig = {
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
} satisfies LayoutConfig;

const eachPcoLayoutConfig = {
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
              href: PATH.EACH.PAYMENT.LIST('test2024'),
            },
            {
              key: 'EACH/PAYMENT/SETTING',
              title: '결제 설정',
              href: PATH.EACH.PAYMENT.SETTING('test2024'),
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
                  href: PATH.EACH.USER.ATTENDEE.CREATE('test2024'),
                },
                {
                  key: 'EACH/USER/ATTENDEE/JOIN/LIST',
                  title: '가입 회원 목록',
                  href: PATH.EACH.USER.ATTENDEE.JOIN_LIST('test2024'),
                },
                {
                  key: 'EACH/USER/ATTENDEE/REGISTER/LIST',
                  title: '등록 회원 목록',
                  href: PATH.EACH.USER.ATTENDEE.REGISTER_LIST('test2024'),
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
                  href: PATH.EACH.USER.FACULTY.CREATE('test2024'),
                },
                {
                  key: 'EACH/USER/FACULTY/LIST',
                  title: 'X 연자 목록 X',
                  href: PATH.EACH.USER.FACULTY.LIST('test2024'),
                },
                {
                  // executives
                  key: 'EACH/USER/EXECUTIVES/LIST',
                  title: 'X 임원진 목록 X',
                  href: PATH.EACH.USER.EXECUTIVES.LIST('test2024'),
                },
              ],
            },
          ],
        },
        {
          key: 'EACH/ME',
          title: '문자 & 이메일',
          icon: 'tent',
          items: [
            {
              key: 'EACH/ME/MESSAGE',
              title: '문자 관리',
              icon: 'tent',
              items: [
                {
                  key: 'EACH/ME/MESSAGE/TEMPLATE',
                  title: '문자 양식 확인',
                  href: PATH.EACH.ME.MESSAGE.TEMPLATE('test2024'),
                },
                {
                  key: 'EACH/ME/MESSAGE/SEND',
                  title: '문자 보내기',
                  href: PATH.EACH.ME.MESSAGE.SEND('test2024'),
                },
                {
                  key: 'EACH/ME/MESSAGE/LIST',
                  title: '문자 리스트',
                  href: PATH.EACH.ME.MESSAGE.LIST('test2024'),
                },
              ],
            },
            {
              key: 'EACH/ME/B',
              title: '이메일 관리',
              icon: 'tent',
              items: [
                {
                  key: 'EACH/ME/EMAIL/TEMPLATE',
                  title: '이메일 양식 확인',
                  href: PATH.EACH.ME.EMAIL.TEMPLATE('test2024'),
                },
                {
                  key: 'EACH/ME/EMAIL/SEND',
                  title: '이메일 보내기',
                  href: PATH.EACH.ME.EMAIL.SEND('test2024'),
                },
                {
                  key: 'EACH/ME/EMAIL/LIST',
                  title: '이메일 리스트',
                  href: PATH.EACH.ME.EMAIL.LIST('test2024'),
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
              href: PATH.EACH.PROGRAM.LIST('test2024'),
            },
            {
              key: 'EACH/PROGRAM',
              title: '프로그램 생성하기',
              href: PATH.EACH.PROGRAM.CREATE('test2024'),
            },
            {
              key: 'EACH/PROGRAM/DETAIL',
              title: '프로그램 수정하기',
              href: PATH.EACH.PROGRAM.DETAIL('test2024', 1),
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
              href: PATH.EACH.TERMS.TU('test2024'),
            },
            {
              key: 'EACH/TERMS/PRIVACY_POLICY',
              title: '개인정보 처리방침',
              href: PATH.EACH.TERMS.PP('test2024'),
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
              href: PATH.EACH.GALLERY.LIST('test2024'),
            },
            {
              key: 'EACH/GALLERY',
              title: '갤러리 추가하기',
              href: PATH.EACH.GALLERY.CREATE('test2024'),
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
              href: PATH.EACH.NOTICE.LIST('test2024'),
            },
            {
              key: 'EACH/NOTICE',
              title: '공지사항 추가하기',
              href: PATH.EACH.NOTICE.CREATE('test2024'),
            },
          ],
        },
        {
          key: 'EACH/ETC',
          title: '기타',
          icon: 'tent',
          items: [
            {
              key: 'EACH/ETC/GREETINGS',
              title: '인사말',
              href: PATH.EACH.ETC.GREETINGS('test2024'),
            },
            {
              key: 'EACH/ETC/VENUE_INFORMATION',
              title: '오시는 길',
              href: PATH.EACH.ETC.VENUE_INFORMATION('test2024'),
            },
            {
              key: 'EACH/ETC/CONSTITUTION',
              title: '학회 회칙',
              href: PATH.EACH.ETC.CONSTITUTION('test2024'),
            },
            {
              key: 'EACH/ETC/FOOTER',
              title: '푸터 관리',
              href: PATH.EACH.ETC.FOOTER('test2024'),
            },
            {
              key: 'EACH/ETC/MENU',
              title: '메뉴 관리',
              href: PATH.EACH.ETC.FOOTER('test2024'),
            },
          ],
        },
      ],
    },
  ],
} satisfies LayoutConfig;

export { layoutConfig, eachPcoLayoutConfig };
