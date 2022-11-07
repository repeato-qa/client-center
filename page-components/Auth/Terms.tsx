import React from 'react';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import { useStore } from '@/lib/use-store';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useHistory } from 'react-router-dom';

const Terms = () => {
  const {
    uiStore: { authStore },
  } = useStore();
  const history = useHistory();

  const [termsAccept, setTermsAccept] = React.useState(false);

  const handleSubmit = () => {
    if (!termsAccept) return;
    authStore.acceptTerms().then(() => history.push('/'));
  };

  return (
    <Box
      sx={{
        mt: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
        Privacy policy & terms of use
      </Typography>
      <Box sx={{ m: 5 }}>
        <Grid container spacing={2}>
          <Typography sx={{ mb: 1 }}>
            You accept that, at REPEATO sole discretion, REPEATO may terminate
            or suspend your access to the Repeato service due to violation of
            below terms or any other reason.
          </Typography>
          <Typography>
            You must read and sign the Privacy policy & Terms of Use before
            using Repeato.
          </Typography>
        </Grid>
        <br />
        <FormControlLabel
          control={
            <Checkbox
              checked={termsAccept}
              onChange={() => setTermsAccept(!termsAccept)}
            />
          }
          label={
            <Typography>
              I agree to the{' '}
              <Link
                href="https://www.repeato.app/terms-of-service/"
                target="_blank"
              >
                terms & conditions
              </Link>{' '}
              and{' '}
              <Link
                href="https://www.repeato.app/privacy-policy/"
                target="_blank"
              >
                privacy policy
              </Link>
              .
            </Typography>
          }
        />
        <Button variant="outlined" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default Terms;
