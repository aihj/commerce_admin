'use client';

import * as React from 'react';

import { VerticalLayout } from './vertical/VerticalLayout';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps): React.JSX.Element => {
  return <VerticalLayout>{children}</VerticalLayout>;
};

export { Layout };
