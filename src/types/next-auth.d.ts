// NextAuth의 type 형식을 커스터마이징
import { User } from '@/types/user';

declare module 'next-auth' {
  interface Session {
    user: User;
  }
}
