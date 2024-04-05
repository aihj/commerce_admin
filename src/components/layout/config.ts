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
          title: 'Committee',
          href: PATH.COMMITTEE.LIST,
          icon: 'tent',
          items: [
            {
              key: 'customers',
              title: 'List customers',
              href: PATH.COMMITTEE.LIST,
            },
            {
              key: 'customers:[id]',
              title: 'Create customer',
              href: PATH.COMMITTEE.DETAIL,
            },
          ],
        },
      ],
    },
  ],
} satisfies LayoutConfig;
