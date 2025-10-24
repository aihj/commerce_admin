'use client';

import * as React from 'react';
import { useEffect } from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { PATH } from '@/paths';
import { DynamicLogo } from '@/components/core/Logo';
import { signIn, useSession } from 'next-auth/react';
import { phoneRegex } from '@/zod';
import { logger } from '@/lib/logger/defaultLogger';
import Swal from 'sweetalert2';
import { DevTool } from '@hookform/devtools';

// ----------------------------------------------------------------------------------
export type SignInFormValues = {
  // [process.env.NEXT_PUBLIC_LOGIN_TYPE]: string;
  email?: string;
  phone?: string;
  password: string;
  serviceType: string;
  conferenceIdx: number | null;
};
const schema = zod.object({
  email: zod
    .string()
    .min(1, { message: '이메일은 필수로 입력하셔야 합니다.' })
    .email(),
  // phone: zod
  //   .string()
  //   .min(1, { message: '전화번호는 필수로 입력하셔야 합니다.' })
  //   .regex(phoneRegex, '잘못된 전화번호 형식입니다.'),
  password: zod.string().min(1, { message: '패스워드는 필수값입니다.' }),
  serviceType: zod.string().min(1, { message: '서비스 타입은 필수값입니다.' }),
});
// ----------------------------------------------------------------------------------

// **************** 로그인하기 ****************
export function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const { status } = useSession();
  const [showPassword, setShowPassword] = React.useState<boolean>();
  // const [isPending, setIsPending] = React.useState<boolean>(false);
  const [isPending] = React.useState<boolean>(false);

  useEffect(() => {
    console.log('useSession status : ' + status);
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<SignInFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      conferenceIdx: null,
    },
  });
  logger.debug('errors', errors);
  // ********************* 로그인 하기 *********************
  const onSubmit = React.useCallback(
    async (values: SignInFormValues): Promise<void> => {
      console.log('onSubmit values : ', values);
      await signIn('credentials', {
        redirect: false,
        ...values,
      }).then((result) => {
        // TODO : nextAuth가 서버가 없을때 return을 400을 하는것이 아니라 401을 함...400을 했으면 좋겠는데..
        if (result?.status === 401) {
          Swal.fire({
            icon: 'error',
            text:
              result.error ===
                "Cannot read properties of undefined (reading 'data')" ||
              !result.error
                ? '현재 서버에 문제가 있어 로그인을 진행하실수 없습니다. 관리자에게 문의하여주세요.'
                : result.error,
          });
        }
      });
    },
    []
  );

  return (
    <Stack spacing={4}>
      <div>
        <Box
          component={RouterLink}
          href={PATH.HOME}
          sx={{ display: 'inline-block', fontSize: 0 }}
        >
          <DynamicLogo
            colorDark="light"
            colorLight="dark"
            height={32}
            width={122}
          />
        </Box>
      </div>
      <Stack spacing={1}>
        <Typography variant="h5">로그인</Typography>
        {/* <Typography color="text.secondary" variant="body2">
          계정이 없습니까?
          <Link
            component={RouterLink}
            href={PATH.AUTH.NEXT_AUTH.REGISTER}
            variant="subtitle2"
          >
            {' '}
            회원가입하기
          </Link>
        </Typography> */}
      </Stack>
      <Stack spacing={3}>
        <Stack spacing={2}>
          <DevTool control={control}/>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <input
                type="hidden"
                {...register('serviceType')}
                value={process.env.NEXT_PUBLIC_AUTH_TYPE}
              />

              {process.env.NEXT_PUBLIC_LOGIN_TYPE === 'email' ? (
                <Controller
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.email)}>
                      <InputLabel required>Email address</InputLabel>
                      <OutlinedInput {...field} type="email" />
                      {errors.email ? (
                        <FormHelperText error>
                          {errors.email.message}
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                  )}
                />
              ) : (
                <Controller
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.phone)}>
                      <InputLabel required>Phone Number</InputLabel>
                      <OutlinedInput {...field} type="phone" />
                      {errors.phone ? (
                        <FormHelperText error>
                          {errors.phone.message}
                        </FormHelperText>
                      ) : null}
                    </FormControl>
                  )}
                />
              )}
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.password)}>
                    <InputLabel required>Password</InputLabel>
                    <OutlinedInput
                      {...field}
                      endAdornment={
                        showPassword ? (
                          <EyeIcon
                            cursor="pointer"
                            fontSize="var(--icon-fontSize-md)"
                            onClick={(): void => {
                              setShowPassword(false);
                            }}
                          />
                        ) : (
                          <EyeSlashIcon
                            cursor="pointer"
                            fontSize="var(--icon-fontSize-md)"
                            onClick={(): void => {
                              setShowPassword(true);
                            }}
                          />
                        )
                      }
                      label="password"
                      type={showPassword ? 'text' : 'password'}
                    />
                    {errors.password ? (
                      <FormHelperText error>
                        {errors.password.message}
                      </FormHelperText>
                    ) : null}
                  </FormControl>
                )}
              />
              {errors.root ? (
                <Alert color="error">{errors.root.message}</Alert>
              ) : null}
              <Button disabled={isPending} type="submit" variant="contained">
                Sign in
              </Button>
            </Stack>
          </form>
          {/* <div>
            <Link
              component={RouterLink}
              href={PATH.AUTH.NEXT_AUTH.RESET_PASSWORD}
              variant="subtitle2"
            >
              Forgot password?
            </Link>
          </div> */}
        </Stack>
      </Stack>
    </Stack>
  );
}
