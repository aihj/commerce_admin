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
import Link from '@mui/material/Link';
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

// ----------------------------------------------------------------------------------
type FormValues = {
  adminId: string;
  adminPw: string;
};
const schema = zod.object({
  adminId: zod.string().min(1, { message: 'Email is required' }).email(),
  adminPw: zod.string().min(1, { message: 'Password is required' }),
});
type Values = zod.infer<typeof schema>;
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
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  // ********************* 로그인 하기 *********************
  const onSubmit = React.useCallback(async (values: Values): Promise<void> => {
    console.log('onSubmit values : ', values);
    const result = await signIn('credentials', values);
    console.log('login result', result);
  }, []);

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
        <Typography color="text.secondary" variant="body2">
          계정이 없습니까?
          <Link
            component={RouterLink}
            href={PATH.AUTH.NEXT_AUTH.REGISTER}
            variant="subtitle2"
          >
            {' '}
            회원가입하기
          </Link>
        </Typography>
      </Stack>
      <Stack spacing={3}>
        <Stack spacing={2}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Controller
                control={control}
                name="adminId"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.adminId)}>
                    <InputLabel>Email address</InputLabel>
                    <OutlinedInput {...field} type="adminId" />
                    {errors.adminId ? (
                      <FormHelperText>{errors.adminId.message}</FormHelperText>
                    ) : null}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="adminPw"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.adminPw)}>
                    <InputLabel>Password</InputLabel>
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
                      label="adminPw"
                      type={showPassword ? 'text' : 'password'}
                    />
                    {errors.adminPw ? (
                      <FormHelperText>{errors.adminPw.message}</FormHelperText>
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
          <div>
            <Link
              component={RouterLink}
              href={PATH.AUTH.NEXT_AUTH.RESET_PASSWORD}
              variant="subtitle2"
            >
              Forgot password?
            </Link>
          </div>
        </Stack>
      </Stack>
    </Stack>
  );
}
