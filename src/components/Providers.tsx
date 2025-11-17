'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

interface ProviderProps {
  children: React.ReactNode;
}

// 커스텀 프로바이더들은 Layout에 바로 추가하지 말고 이곳에다가 추가
const queryClient = new QueryClient({});
const Providers = ({ children }: ProviderProps) => {
  const persistor = persistStore(store);
  return (
    <>
      {/* redux & redux-persist */}
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {/* react-query */}
          <QueryClientProvider client={queryClient}>
            {/* nextAuth session을 사용할 수 있게 도와주는 프로바이터*/}
            <SessionProvider>{children}</SessionProvider>
          </QueryClientProvider>{' '}
        </PersistGate>
      </Provider>
    </>
  );
};

export default Providers;
