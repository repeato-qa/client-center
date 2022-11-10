import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Box, Typography, Link as ExternalLink } from '@mui/material';
import { useStore } from '@/lib/use-store';
import { envConfig } from '@/helpers/generic';

export const VerifyEmail = ({ valid /*, user */ }) => {
  const {
    uiStore: { /* authStore,*/ setAlert },
  } = useStore();
  const router = useRouter();

  const [emailConfirmed, setEmailConfirmed] = React.useState(false);

  React.useEffect(() => {
    if (valid) {
      setAlert('Email verified successfully.');
      setEmailConfirmed(true);

      // if (user?.invited) {
      //   authStore.setConfirmedEmail(user?.email);
      //   router.push('/set-password');
      //   return;
      // }
    } else {
      setTimeout(() => router.push('/login'), 7000);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h5">
        Email Confirmation
      </Typography>
      <Box component="form" sx={{ mt: 3 }}>
        {!emailConfirmed && (
          <Typography>
            Invalid token or link is expired. Redirecting...
          </Typography>
        )}
        {emailConfirmed && (
          <Typography>
            Email verified successfully. You can now log into{' '}
            <ExternalLink
              href={envConfig.repeato_app + 'login'}
              target="_blank"
            >
              Repeato Studio
            </ExternalLink>{' '}
            and <Link href="/login">Repeato Client Center.</Link>
          </Typography>
        )}
      </Box>
    </Box>
  );
};
