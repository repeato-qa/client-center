import React from 'react';
import { useStore } from '@/lib/use-store';
import {
  Box,
  Avatar,
  Typography,
  TextField,
  Grid,
  Button,
} from '@mui/material';
import Link from 'next/link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { parseGetErrMsg } from '@/helpers/generic';

const ForgetPasswordIndex = () => {
  const { uiStore: { authStore, setAlert } = {} } = useStore();

  const [email, setEmail] = React.useState('');
  const [errors, setErrors] = React.useState({ email: '' });
  const [formSubmit, setFormSubmit] = React.useState(false);

  const onChange = (event: any) => {
    const { value } = event.target;
    setEmail(value);
    setErrors({
      email:
        !/\S+@\S+\.\S+/.test(value) && !value
          ? 'Please provide valid email.'
          : '',
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormSubmit(true);
    const invalidForm = !/\S+@\S+\.\S+/.test(email);
    if (invalidForm) {
      setErrors({ email: 'Please provide valid email.' });
      return false;
    }

    authStore
      .forgotPassword(email)
      .then(() => {
        setAlert('Please check your email for password reset link.');
        setEmail('');
      })
      .catch((err: Error) => {
        setErrors({ email: parseGetErrMsg(err) });
      })
      .finally(() => setFormSubmit(false));
  };

  return (
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Forgot Password?
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          helperText={errors.email}
          error={!!errors.email}
          value={email}
          onChange={onChange}
        />

        <Button
          type="submit"
          fullWidth
          disabled={formSubmit}
          variant="outlined"
          sx={{ mt: 3, mb: 2 }}
        >
          Send Email
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link href="/login">{'Goto Login Page'}</Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ForgetPasswordIndex;
