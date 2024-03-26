// NextAuth의 type 형식을 커스터마이징
declare module 'next-auth' {
  interface Session {
    user: {
      accessToken?: string;

      auth?: string;
      adminIdx?: string;
      adminId?: string;
      adminName?: string;

      adminProfileHost?: string;
      adminProfilePath?: string;
      adminProfileName?: string;

      adminPw?: string;
      isLoggedIn?: boolean;
    };
  }
}
