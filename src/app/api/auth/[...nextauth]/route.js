import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { useUser } from '../../../../hooks/useUser';

// import Swal from "sweetalert2";

// /api/auth/* 의 경로로 요청되는 모든 request는 위 파일에서 hand
const handler = NextAuth({
  // TODO: 아래의 값이 올바른지 검증 필요함(사실 백엔드에서 생성했기때문에 이 부분은 삭제 필요함)
  // session: {
  //   strategy: "jwt",
  //   secret: process.env.AUTH_SECRET,
  //   maxAge: 30 * 24 * 60 * 60, // 30 days
  // },
  providers: [
    // *********************** 메디스태프 로그인 ***********************
    CredentialsProvider({
      // 인증 제공자의 이름(프로바이더의 이름)을 정의
      name: 'medistaff_admin',

      // 실제 로그인 input의 내용
      credentials: {
        email: {
          label: 'adminId',
          type: 'text',
          placeholder: '이메일을 입력해주세요.',
        },
        password: { label: 'adminPw', type: 'password' },
      },

      // 로그인을 처리하는 함수
      /*
       csrfToken: '3bff7e7bdb379431d9cfab644ba0331d01732e579cbe8fdd14f38d611ca1c537',
        email: 'fsdafsd',
        password: 'fsdf'
      \*/
      async authorize(credentials, req) {
        try {
          console.log('<authorize> credentials', credentials);
          const user = axios
            .post(
              `${process.env.AUTH_BACKEND_URL}/api/medistaff/admin/login`,
              credentials
            )
            .then((response) => {
              console.log('<authorize> success');
              if (response.data.content.accessToken) {
                return response.data.content;
              } else {
                throw new Error('Invalid credentials');
              }
            })
            .catch((result) => {
              console.log('<authorize> error', result.response.data.message);
              throw new Error(result.response.data.message);
              // Swal.fire({
              //   icon: 'error',
              //   text: result.response
              //     ? result.response.data.message
              //     : "현재 서버에 문제가 있습니다. 관리자에게 문의해주세요."
              // })
            });
          // const user = authClient.nextAuthLogin(credentials);

          // null이 아닌것을 리턴할 경우 nextAuth는 로그인으로 감주함
          // 이때의 user는 promise 객체
          if (user) {
            console.log('록인 성공 user info : ', user);
            return user;
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null;

            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        } catch (error) {
          console.log('<authorize> 실패', error);
          return null;
        }
      },
    }),
    // CredentialsProvider({
    //   id: "register",
    //   async authorize(credentials) {
    //     try {
    //       return await Auth.signup(credentials);
    //     } catch (error) {
    //       throw new Error(error.message);
    //     }
    //   },
    // }),
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

    // 2. signIn 이후 JWT 컬백이 호출
    /*<jwt> token {
      name: undefined,
      email: undefined,
      picture: undefined,
      sub: undefined
    }*/

    // TODO : user 정보를 받아서 token에 전달해야함
    async jwt({ token, user }) {
      console.log('<jwt> user', user);
      console.log('<jwt> token', token);
      let newToken = { ...token };

      if (user) {
        newToken = {
          ...newToken,
          user,
        };
      }

      return newToken;
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

    async session({ session, token }) {
      console.log('<session> session', session);
      console.log('<session> token', token);
      if (token) {
        session.user = {
          ...token.user,
          isLoggedIn: true,
        };
      }
      session.user.isLoggedIn = true;
      // session.user = session; 이걸 넣으면 에러가 생기는데 정작 user에 isLoggedIn 뺘고는 아무값도 안들어가있ㅇ므
      return session;
    },
  },
  // A database is optional, but required to persist accounts in a database
  // database: process.env.DATABASE_URL,
  secret: process.env.NEXTAUTH_SECRET,

  // NextAuth의 기본 페이지말고 커스텀 페이지로 대체하기
  pages: {
    signIn: '/auth/sign-in',
    signOut: '/auth/logout',
    signUp: '/auth/register', // 회원가입
  },
});
export { handler as GET, handler as POST };
