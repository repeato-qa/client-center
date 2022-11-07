import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useStore } from '@/lib/use-store';
import { getParamsFromUrl, envConfig } from '../../helpers/generic';

const ConfirmEmail = () => {
  const {
    uiStore: { authStore, setAlert },
  } = useStore();
  const navigate = useHistory();

  const [emailConfirmed, setEmailConfirmed] = React.useState(false);

  React.useEffect(() => {
    const { token, tokenId, email, invited } = getParamsFromUrl(
      window.location.hash.replace('/confirm-email?', '')
    );
    authStore
      .confirmEmail({ token, tokenId, email })
      .then(() => {
        setAlert('Email verified successfully.');
        if (invited === 'true') {
          authStore.setConfirmedEmail(email);
          navigate.push('/#/set-password');
          return;
        }
        setEmailConfirmed(true);
        // navigate.push('/#/login');
      })
      .catch(() => setEmailConfirmed(true));
  }, []);

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
        {!emailConfirmed && <Typography>Please wait...</Typography>}
        {emailConfirmed && (
          <Typography>
            Email verified successfully. You can now log into{' '}
            <Link
              to="#"
              onClick={() =>
                window.open(envConfig.repeato_app + 'login', '_blank')
              }
            >
              Repeato Studio
            </Link>{' '}
            and <Link to="/#/login">Repeato Client Center.</Link>
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ConfirmEmail;
