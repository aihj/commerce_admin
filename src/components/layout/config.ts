import { PATH } from '@/paths';
import type { NavItemConfig } from '@/types/nav';
export interface LayoutConfig {
  navItems: NavItemConfig[];
}

// TODO: 권한마다 보여주는 레이아웃을 다르게 할려면 어떻게 해야할까?
// TODO : 생각해보니 권한마다가 아니라 경로마다임 confStringIdx를 포함할경우에는
const layoutConfig = {
  navItems: [
    {
      key: 'dashboards',
      title: 'Dashboards',
      items: [
        {
          key: 'overview',
          title: 'Overview',
          href: '/',
          icon: 'house',
          auth: '',
        },
      ],
    },
    {
      key: 'general',
      title: '모든 학회 관리',
      items: [
        {
          key: 'committee',
          title: '사무국',
          icon: 'tent',
          items: [
            {
              key: 'committee:create',
              title: '사무국 생성하기',
              href: PATH.COMMITTEE.CREATE,
              auth: '',
            },
            {
              key: 'customers:details',
              title: '사무국 수정하기',
              href: PATH.COMMITTEE.DETAIL('1'),
              auth: '',
            },
          ],
        },

        // TODO : 이모티콘 뭘로 할지 정하는건 필요함
        {
          key: 'enterprise-conference',
          title: 'Enterprise 학회',
          icon: 'users',
          items: [
            {
              key: 'enterprise-conferences',
              title: 'Enterprise 학회 목록',
              href: PATH.CONFERENCE.ENTERPRISE.LIST,
            },
            {
              key: 'conference:create',
              title: 'Enterprise 학회 생성',
              href: PATH.CONFERENCE.ENTERPRISE.CREATE,
            },
            {
              key: 'conference:details',
              title: 'Enterprise 학회 수정',
              href: PATH.CONFERENCE.ENTERPRISE.DETAIL('1'),
            },
          ],
        },
        {
          key: 'alliance-conference',
          title: 'Alliance 학회',
          icon: 'users',
          items: [
            {
              key: 'alliance-conferences',
              title: 'Alliance 학회 목록',
              href: PATH.CONFERENCE.ALLIANCE.LIST,
            },
            {
              key: 'alliance:create',
              title: 'Alliance 학회 생성',
              href: PATH.CONFERENCE.ALLIANCE.CREATE,
            },
            {
              key: 'alliance:details',
              title: 'Alliance 학회 수정',
              href: PATH.CONFERENCE.ALLIANCE.DETAIL('1'),
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
      key: 'eath-pco',
      title: '학회 각각의 정보',
      items: [
        {
          key: 'programs',
          title: '프로그램',
          icon: 'tent',
          items: [
            {
              key: 'programs:list',
              title: '프로그램 목록',
              href: PATH.EATH.PROGRAM.LIST,
            },
            {
              key: 'program:create',
              title: '프로그램 생성하기',
              href: PATH.EATH.PROGRAM.CREATE,
            },
            {
              key: 'program:details',
              title: '프로그램 수정하기',
              href: PATH.EATH.PROGRAM.DETAIL('1'),
            },
            {
              key: 'session:details',
              title: '프로그램 세션 수정하기',
              href: PATH.EATH.PROGRAM.SESSION_GROUP.DETAIL('1'),
            },
          ],
        },
      ],
    },
  ],
} satisfies LayoutConfig;

export { layoutConfig, eachPcoLayoutConfig };
