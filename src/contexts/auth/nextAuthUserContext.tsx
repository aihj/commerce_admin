'use client';

import * as React from 'react';

import type { User } from '@/types/user';
import { authClient } from '@/lib/auth/client';
import { defaultLogger } from '@/lib/logger/defaultLogger';

import type { UserContextValue } from './types';

export const NextAuthUserContext = React.createContext<
  UserContextValue | undefined
>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({
  children,
}: UserProviderProps): React.JSX.Element {
  const [state, setState] = React.useState<{
    user: User | null;
    error: string | null;
    isLoading: boolean;
  }>({
    user: null,
    error: null,
    isLoading: true,
  });

  // 사용자 정보 업데이트 함수
  const updateUser = (newUser: User | null) => {
    setState((prevState) => ({
      ...prevState,
      user: newUser,
    }));
  };

  // 사용자 세션을 확인하고 세션 정보를 가져오는 기능
  const checkSession = React.useCallback(async (): Promise<void> => {
    try {
      const { data, error } = await authClient.getUser();

      if (error) {
        defaultLogger.error(error);
        setState((prev) => ({
          ...prev,
          user: null,
          error: 'Something went wrong',
          isLoading: false,
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        user: data ?? null,
        error: null,
        isLoading: false,
      }));
    } catch (err) {
      defaultLogger.error(err);
      setState((prev) => ({
        ...prev,
        user: null,
        error: 'Something went wrong',
        isLoading: false,
      }));
    }
  }, []);

  React.useEffect(() => {
    checkSession().catch((err) => {
      defaultLogger.error(err);
      // noop
    });
  }, []);

  return (
    <NextAuthUserContext.Provider
      value={{ ...state, updateUser, checkSession }}
    >
      {children}
    </NextAuthUserContext.Provider>
  );
}

export const UserConsumer = NextAuthUserContext.Consumer;
