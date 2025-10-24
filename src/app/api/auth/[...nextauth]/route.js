import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { adminPostRefreshToken } from '../../../../api/authApi';

// const AUTH_BACKEND_URL =
//   process.env.NEXT_PUBLIC_APP_ENV === 'development'
//     ? 'https://testauth.medistaff.co.kr'
//     : 'https://auth.medistaff.co.kr';

// /api/auth/* 의 경로로 요청되는 모든 request는 위 파일에서 hand
const handler = NextAuth({
  providers: [
    // *********************** 메디스태프 로그인 ***********************
    CredentialsProvider({
      // 인증 제공자의 이름(프로바이더의 이름)을 정의(tbl_web_service.wservice_name)
      name: process.env.NEXT_PUBLIC_AUTH_TYPE,

      // 실제 로그인 input의 내용
      credentials: {
        [process.env.NEXT_PUBLIC_LOGIN_TYPE]: {
          label: process.env.NEXT_PUBLIC_LOGIN_TYPE,
          type: 'text',
          placeholder:
            process.env.NEXT_PUBLIC_LOGIN_TYPE === 'email'
              ? 'medistaff@naver.com'
              : '000-0000-0000',
        },
        password: { label: 'password', type: 'password' },
        serviceType: { label: 'serviceType', type: 'text' },
        // conferenceIdx: { label: 'conferenceIdx', type: 'number' },
      },

      async authorize(credentials) {
        
        try {
          
          console.log('<authorize> credentials', credentials);
          const user = await axios
            .post(
              `${process.env.NEXT_PUBLIC_AUTH_BACKEND_URL}/request_token`,
              credentials,
              {
                headers: {
                  'wserviceName': 'medistaff_admin',
                  'Content-Type': 'application/json',
                  'Accept': '*/*',
                },
              }
            )
            .then((response) => {
              console.log('<authorize> success');
              console.log(response.data);
              if (response.data.content.accessToken) {

                return response.data.content;
              } else {
                throw new Error(response.data.message);
              }
            })
            .catch((result) => {
              console.log('<authorize> error', result);
              throw new Error(result.response.data.message);
            });
          // null이 아닌것을 리턴할 경우 nextAuth는 로그인으로 감주함(이때의 user는 promise 객체)
          if (user) {
            console.log('로그인 성공 user info : ', user);
            return user;
          } else {
            console.error('로그인 실패 리턴된 유저 정보가 없습니다.');
            return null;
          }
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],

  // 사용자가 로그인을 한 경우 발생하는 함수들
  callbacks: {
    async signIn({ user }) {
      if (user) {
        console.log('<signIn> user 로그인 성공', user);
        return true;
      }
      return false;
    },

    async jwt({ token, user, trigger, session }) {
      console.log('<jwt> token', token);
      console.log('<jwt> user', user); // 최초 로그인 외에는 undefined

      if (trigger === 'update') {
        console.log(trigger, session);
        token.conferenceIdx = session.conferenceIdx;
      }

      // access 토큰의 만료시간을 확인하고 토큰 만료 10분전이라면 미리 새로운 토큰 갱신하기
      // accessTokenExpires: '2024-06-09T02:06:31.000+00:00',
      const accessTokenExpirationTime = Date.parse(token.accessTokenExpires); // 문자열을 시간으로 변환
      const currentTime = new Date().getTime(); // 현재 시간을 밀리초로 가져옴
      const timeRemaining =
        accessTokenExpirationTime - (currentTime + 10 * 60 * 1000); // 밀리초로 토큰 만료까지 남은 시간 계산 timeRemaining 1186905
      console.log('<jwt> accessToken의 유효시간', timeRemaining);
      console.log('<jwt> token.refreshToken', token.refreshToken);
      if (!token.refreshToken) {
        console.log('<jwt> token의 refresh 토큰 정보가 없네요?');
        return { ...token, ...user };
      }
      if (timeRemaining > 0 || isNaN(timeRemaining))
        return { ...token, ...user };
      if (timeRemaining <= 0) {
        const newToken = await adminPostRefreshToken(
          token.accessToken,
          token.refreshToken,
          token.serviceType
        )
          .then((result) => {
            console.log(
              '<adminPostRefreshToken> result.data.content : ',
              result.data.content
            );
            return {
              ...token,
              ...user,
              accessToken: result.data.content.accessToken,
              accessTokenExpires: result.data.content.accessTokenExpires,
            };
          })
          .catch((error) => {
            console.log(
              '<jwt> refresh 토큰 갱신에 실패하였습니다. error : ',
              error
            );

            return {
              error: 'refresh_token_update_failed',
            };
          });
        return { ...newToken };
      }
    },

    // 리다이렉트 정보
    async redirect() {
      const BASE_URL = process.env.NEXT_PUBLIC_NEXTAUTH_URL;
      console.log('<redirect> BASE_URL', BASE_URL);
      const url = `${BASE_URL}/`;
      return url;
    },

    // JWT에서 저장된 모든 정보는 세션 콜백에서 즉시 사용 가능
    async session({ session, token, user, trigger, newSession }) {
      console.log('<session> session', session);
      console.log('<session> token', token);
      console.log('<session> user', user);

      if (trigger === 'update') {
        console.log(trigger, newSession);
        session.user.conferenceIdx = newSession.conferenceIdx;
      }
      if (token) {
        session.user = {
          ...token,
          isLoggedIn: true,
        };
      }
      session.user.isLoggedIn = true;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,

  // NextAuth의 기본 페이지말고 커스텀 페이지로 대체하기
  // pages: {
  //   signIn: '/auth/login',
  //   signOut: '/auth/logout',
  //   signUp: '/auth/register', // 회원가입
  // },
});
export { handler as GET, handler as POST };
