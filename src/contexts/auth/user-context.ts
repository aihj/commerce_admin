import type * as React from 'react';

import { config } from '@/config';
import { AuthStrategy } from '@/lib/auth/strategy';

import {
  NextAuthUserContext as CustomUserContext,
  UserProvider as CustomUserProvider,
} from './nextAuthUserContext';
import type { UserContextValue } from './types';

let UserProvider: React.FC<{ children: React.ReactNode }>;

let UserContext: React.Context<UserContextValue | undefined>;

switch (config.auth.strategy) {
  case AuthStrategy.CUSTOM:
  case AuthStrategy.NEXT_AUTH:
  case AuthStrategy.jwt:
    UserContext = CustomUserContext;
    UserProvider = CustomUserProvider;
    break;
  default:
    throw new Error(
      'Invalid auth strategy config.auth.strategy:' + config.auth.strategy
    );
}

export { UserProvider, UserContext };
