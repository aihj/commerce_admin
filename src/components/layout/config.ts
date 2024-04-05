import { PATH } from '@/paths';
import type { NavItemConfig } from '@/types/nav';
export interface LayoutConfig {
  navItems: NavItemConfig[];
}

// 메뉴바
export const layoutConfig = {
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
        },
      ],
    },
    {
      key: 'general',
      title: 'General',
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
            },
            {
              key: 'customers:details',
              title: '사무국 수정하기',
              href: PATH.COMMITTEE.DETAIL('1'),
            },
          ],
        },

        // TODO : 이모티콘 뭘로 할지 정하는건 필요함
        {
          key: 'conference',
          title: 'Enterprise 학회',
          icon: 'users',
          items: [
            {
              key: 'enterprise-conferences',
              title: 'Enterprise 학회 목록',
              href: PATH.CONFERENCE.LIST,
            },
            {
              key: 'conference:create',
              title: 'Enterprise 학회 생성',
              href: PATH.CONFERENCE.CREATE,
            },
            {
              key: 'conference:details',
              title: 'Enterprise 학회 수정',
              href: PATH.CONFERENCE.DETAIL('1'),
            },
          ],
        },
      ],
    },
  ],
} satisfies LayoutConfig;
