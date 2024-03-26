'use client';

import React from 'react';
import { SessionProvider } from 'next-auth/react';

interface ProviderProps {
  children: React.ReactNode;
}

// 커스텀 프로바이더들은 Layout에 바로 추가하지 말고 이곳에다가 추가
const Providers = ({ children }: ProviderProps) => (
  <SessionProvider>{children}</SessionProvider> // nextAuth session을 사용할 수 있게 도와주는 프로바이터
);

export default Providers;
