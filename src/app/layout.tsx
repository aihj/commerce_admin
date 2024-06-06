import * as React from 'react';

import '@/styles/global.css';
import { config } from '@/config';
import { ThemeProvider } from '@/components/core/theme-provider';
import { LocalizationProvider } from '@/components/core/LocalizationProvider';
import { Toaster } from '@/components/core/Toaster';
import { UserProvider } from '@/contexts/auth/user-context';
import Providers from '@/components/Providers';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({
  children,
}: LayoutProps): Promise<React.JSX.Element> {
  return (
    <html data-mui-color-scheme={config.site.colorScheme} lang="en">
      <body>
        <Providers>
          <LocalizationProvider>
            <UserProvider>
              <ThemeProvider>
                {children}
                <Toaster position="bottom-right" />
              </ThemeProvider>
            </UserProvider>{' '}
            {/* NextAuth 인증 관련 */}
          </LocalizationProvider>
        </Providers>{' '}
        {/* 추가 프로바이더 정의 한 곳 */}
      </body>
    </html>
  );
}
