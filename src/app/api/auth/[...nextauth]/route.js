import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { adminPostRefreshTokenSES } from '../../../../api/authApi';

// import Swal from "sweetalert2";

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
        conferenceIdx: { label: 'conferenceIdx', type: 'number' },
      },

      // 로그인을 처리하는 함수
      /*
       csrfToken: '3bff7e7bdb379431d9cfab644ba0331d01732e579cbe8fdd14f38d611ca1c537',
        email: 'fsdafsd',
        password: 'fsdf'
      \*/
      async authorize(credentials, response, req) {
        try {
          console.log('<authorize> credentials', credentials);
          const user = await axios
            // TODO
            .post(`${process.env.AUTH_BACKEND_URL}/request_token`, credentials)
            // .post(`https://testauth.medistaff.co.kr/request_token`, credentials)
            .then((response) => {
              console.log('<authorize> success');
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
            // const cookies = user.headers['refreshToken'];
            // response.setHeader('Set-Cookie', cookies);

            console.log('로그인 성공 user info : ', user);
            return user;
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            console.error('로그인 실패 리턴된 유저 정보가 없습니다.');
            return null;

            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],

  // 사용자가 로그인을 한 경우 발생하는 함수들
  callbacks: {
    // 1. 사용자가 로그인을 할 경우
    /*
<signIn> user 로그인 성공 = {
  accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJpc3MiOiJNRURJU1RBRkYiLCJpYXQiOjE3MTA5MTQ0ODQsImV4cCI6MTcxMDkxNjI4NCwiYXVkIjoibWVkaXN0YWZmX2FkbWluIiwic3ViIjoiamhnMDk3QG1lZGlzdGFmZi5jby5rciIsImF1dGgiOiJtZWRpc3RhZmZfYWRtaW5fdG9wIn0.ueERLrRpHPMI6CtXL2-sipKtFtNQu6RqbNKkCi8ItAu_hycPDnuObK_V_Zauszyl',
  refreshToken: null,
  auth: 'medistaff_admin_top',
  adminIdx: 1,
  adminId: 'jhg097@medistaff.co.kr',
  adminName: '정혜경',
  adminProfileHost: null,
  adminProfilePath: null,
  adminProfileName: null
}*/
    async signIn({ user }) {
      if (user) {
        console.log('<signIn> user 로그인 성공', user);
        return true;
      }
      return false;
    },

    /*<jwt> token {
      email: null,
      serviceType: 'pco_client',
      wuserIdx: 829,
      wroleName: null,
      phone: 'WB37qYlBSY2k72CWfNWBtA==',
      accessTokenExpires: '2024-06-09T02:06:31.000+00:00',
      accessToken: 'eyJzZXJ2aWNlX3R5cGUiOiJwY29fY2xpZW50IiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiJkY2RkYzA1Yi01OTdkLTQ2NmEtODE4MC0yZmJhM2UyMjNlYTkiLCJpYXQiOjE3MTc4OTU2NjIsInd1c2VyX2lkeCI6ODI5LCJleHAiOjE3MTc4OTc0NjJ9.6eiShTbiZAQzcuKOpX7GtlEMT-q4C0NlwFb7N32F5TM',
      refreshToken: 'eyJzZXJ2aWNlX3R5cGUiOiJwY29fY2xpZW50IiwiYWxnIjoiSFMyNTYifQ.eyJqdGkiOiI0Mjk5ZGEyZi03Y2Q3LTQ0Y2MtYTVlMC02YjdlZmE2YWRhMTciLCJpYXQiOjE3MTc4OTU2NjIsInd1c2VyX2lkeCI6ODI5LCJleHAiOjE3MTc5MDY0NjJ9.rGEwB9CxmWJInAqOdlgBTEchl-jp639YsrbnfwGxOdo',
      conferenceIdx: 3111,
      iat: 1717895662,
      exp: 1720487662,
      jti: 'fe9bd956-cc53-4d4a-afc8-46140dce8c8e'
    }
    <jwt> user undefined*/
    // TODO : user 정보를 받아서 token에 전달해야함
    // token으로 리턴될때가 있고 유저로 리턴될때가 있네...
    // 사용자가 useSession이나 getSession 등 기존 저장된 세션정보를 확인하려 할 때 호출
    async jwt({ token, user, account, profile, isNewUser }) {
      // return { ...token, ...user };
      console.log('<jwt> token', token);
      console.log('<jwt> user', user); // undefined
      console.log('<jwt> account', account); // undefined
      console.log('<jwt> profile', profile); // undefined
      console.log('<jwt> isNewUser', isNewUser); // undefined
      // 최초 로그인 시 토큰 정보에 만료시간과 refreshToken 세팅하기
      if (account) {
        console.log('<jwt> 최초 로그인을 진행합니다.');
      } else {
        console.log('<jwt> callback을 실행합니다.');
      }

      // access 토큰의 만료시간을 확인하고 토큰 만료 10분전이라면 미리 새로운 토큰 갱신하기
      // accessTokenExpires: '2024-06-09T02:06:31.000+00:00',
      const accessTokenExpirationTime = Date.parse(token.accessTokenExpires); // 문자열을 시간으로 변환
      const currentTime = new Date().getTime(); // 현재 시간을 밀리초로 가져옴
      const timeRemaining =
        accessTokenExpirationTime - (currentTime + 10 * 60 * 1000); // 밀리초로 토큰 만료까지 남은 시간 계산 timeRemaining 1186905
      console.log(
        '<jwt> accessToken의 만료시간 10분전 1: timeRemaining',
        timeRemaining
      );
      console.log('<jwt> token.refreshToken', token.refreshToken);
      if (!token.refreshToken) {
        console.log('<jwt> token의 refresh 토큰 정보가 없네요?');
        return { ...token, ...user };
      }
      if (timeRemaining > 0 || isNaN(timeRemaining))
        return { ...token, ...user };
      if (timeRemaining <= 0) {
        const newToken = await adminPostRefreshTokenSES(
          token.accessToken,
          token.refreshToken,
          token.serviceType
        )
          .then((result) => {
            console.log(
              '<adminPostRefreshToken> result.data.content : ',
              result.data.content
            );
            // axiosInstance.headers.Authorization = `Bearer ${result.data.content.accessToken}`;
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

    // 3. JWT에서 저장된 모든 정보는 세션 콜백에서 즉시 사용 가능
    /*    <session> session {
      user: { name: undefined, email: undefined, image: undefined },
      expires: '2024-04-19T06:01:24.971Z'
    }
    <session> token {
      iat: 1710914484,
      exp: 1713506484,
      jti: 'cc384c15-c142-4e72-893d-3fd3c83c9856'
    }*/

    async session({ session, token, user }) {
      console.log('<session> session', session);
      console.log('<session> token', token);
      console.log('<session> user', user);
      if (token) {
        session.user = {
          ...token,
          isLoggedIn: true,
        };
      }
      session.user.isLoggedIn = true;
      // session.user = session; 이걸 넣으면 에러가 생기는데 정작 user에 isLoggedIn 뺘고는 아무값도 안들어가있ㅇ므
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
