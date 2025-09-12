import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import { MediMain } from '@/components/main/MediMain';
import { useRouter } from 'next/navigation';
import { selectUserRoleNameList } from '@/redux/slices/userSlice';
import { PATH } from '@/paths';
import { getPcoInfoForFirst } from '@/api/publicApi';
import { UPDATE_PCO } from '@/redux/slices/pcoSlice';
import { useSession } from 'next-auth/react';

const Main = () => {
  const userRoleName = useSelector(selectUserRoleNameList);
  const router = useRouter();
  const dispatch = useDispatch();
  const { update } = useSession();

  if (
    userRoleName &&
    userRoleName.length === 1 &&
    userRoleName[0].wroleName.includes('each')
  ) {
    getPcoInfoForFirst({
      conferenceIdx: userRoleName[0].conferenceIdx as number,
      conferenceStringIdx: userRoleName[0].conferenceStringIdx as string,
    })
      .then((result) => {
        dispatch(UPDATE_PCO(result));
        return result;
      })
      .then((result) => {
        dispatch(UPDATE_PCO(result));
        return result;
      })
      .then(() => {
        update({
          conferenceIdx: userRoleName[0].conferenceIdx,
        });
      })
      .then(() => {
        router.replace(
          PATH.EACH.USER.ATTENDEE.REGISTER_LIST(
            userRoleName[0].conferenceStringIdx as string
          )
        );
      });

    return <></>;
  } else {
    return (
      <Box
        sx={{
          maxWidth: 'var(--Content-maxWidth)',
          m: 'var(--Content-margin)',
          p: 'var(--Content-padding)',
          width: 'var(--Content-width)',
        }}
      >
        <MediMain />
      </Box>
    );
  }
};

export { Main };
