import type { User } from '@/types/user';
import { Session } from 'next-auth';

export interface UserContextValue {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  checkSession?: () => Promise<void>;

  /* nextAuth와 통합하기 위한 함수 추가 */
  updateUser?: (session: Session) => void;
}
