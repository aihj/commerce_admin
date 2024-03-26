import * as React from 'react';

import '@/styles/global.css';
import { config } from '@/config';
import { ThemeProvider } from '@/components/core/ThemeProvider';
import { LocalizationProvider } from '@/components/core/LocalizationProvider';
import { Toaster } from '@/components/core/Toaster';
import ReduxProviders from '@/redux/ReduxProvider';
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
              <ReduxProviders>
                <ThemeProvider>
                  {children}
                  <Toaster position="bottom-right" />
                </ThemeProvider>
              </ReduxProviders>
            </UserProvider>{' '}
            {/* NextAuth 인증 관련 */}
          </LocalizationProvider>
        </Providers>{' '}
        {/* 추가 프로바이더 정의 한 곳 */}
      </body>
    </html>
  );
}
