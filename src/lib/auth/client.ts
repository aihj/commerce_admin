'use client';

import type { User } from '@/types/user';
import axios from 'axios';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Sofia',
  lastName: 'Rivers',
  email: 'sofia@devias.io',
} satisfies User;

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  axiosInstance = axios.create({
    baseURL: process.env.AUTH_BACKEND_URL,
    headers: {
      Accept: 'application/json',
    },
  });

  // 회원가입
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    // Make API request

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }

  // 로그인하기
  async SignInWithPassword(
    params: SignInWithPasswordParams
  ): Promise<{ error?: string }> {
    const { email, password } = params;

    // Make API request

    // We do not handle the API, so we'll check if the credentials match with the hardcoded ones.
    if (email !== 'sofia@devias.io' || password !== 'Secret1') {
      return { error: 'Invalid credentials' };
    }

    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }

  nextAuthLogin(credentials): User {
    try {
      console.log('<nextAuthLogin> credentials', credentials);
      this.axiosInstance.post('/login', credentials).then((response) => {
        if (response.data.content.accessToken) {
          return response.data.content;
        } else {
          throw new Error('Invalid credentials');
        }
      });
    } catch (error) {
      console.log('<nextAuthLogin> 실패', error);
    }
  }

  // 회원가입
  nextAuthSignUp(credentials) {
    this.axiosInstance
      .post('/register', credentials)
      .then((response) => {
        return response.data.content;
      })
      .catch((result) => {
        if (result.response.status === 401) {
          throw new Error('Email is already in use');
        }
      });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  // 세션의 유저 정보 가져오기
  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request

    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    return { data: user };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');

    return {};
  }
}

export const authClient = new AuthClient();
