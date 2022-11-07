import React from 'react';
import { useStore } from '@/lib/use-store';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Box,
  Avatar,
  Typography,
  TextField,
  Grid,
  Button,
} from '@mui/material';

const ForgetPasswordToken = ({ valid, token }) => {
  const {
    uiStore: { authStore, setAlert },
  } = useStore();
  const router = useRouter();

  const [resetData, setResetData] = React.useState({
    password: '',
    confirmPassword: '',
    token: '',
  });
  const [errors, setErrors] = React.useState({
    password: '',
    confirmPassword: '',
  });
  const [formSubmit, setFormSubmit] = React.useState(false);

  const onChange = (event: any) => {
    const { name, value } = event.target;
    setResetData({ ...resetData, [name]: value });

    if (
      name === 'confirmPassword' &&
      resetData.password.length === value.length &&
      resetData.password !== value
    ) {
      setErrors({ ...errors, confirmPassword: 'Passowrds does not match.' });
    } else {
      setErrors({ password: '', confirmPassword: '' });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormSubmit(true);
    const invalidForm = resetData.password.length < 8;
    if (invalidForm) {
      setErrors({
        ...errors,
        password: 'Password must be atleast of 8 characters.',
      });
      setFormSubmit(false);
      return false;
    }
    if (resetData.password !== resetData.confirmPassword) {
      setErrors({ ...errors, confirmPassword: 'Passowrds does not match.' });
      setFormSubmit(false);
      return false;
    }

    authStore
      .resetPassword(resetData)
      .then(() => {
        setAlert('Password reset sucessfully, please login.');
        router.push('/login');
      })
      .catch(() => {
        setErrors({
          ...errors,
          password: 'Password reset link is expired or invalid.',
        });
      })
      .finally(() => setFormSubmit(false));
  };

  React.useEffect(() => {
    if (!valid) {
      setAlert('Password reset link is expired or invalid.');
      return;
    }
    setResetData({ ...resetData, token });
  }, [token, valid]); // eslint-disable-line react-hooks/exhaustive-deps

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
        Reset Password
      </Typography>
      {valid && (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            helperText={errors.password}
            error={!!errors.password}
            value={resetData.password}
            onChange={onChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirm-password"
            autoComplete="current-password"
            helperText={errors.confirmPassword}
            error={!!errors.confirmPassword}
            value={resetData.confirmPassword}
            onChange={onChange}
          />

          <Button
            type="submit"
            fullWidth
            disabled={formSubmit}
            variant="outlined"
            sx={{ mt: 3, mb: 2 }}
          >
            Change Password
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login">{'Goto Login Page'}</Link>
            </Grid>
          </Grid>
        </Box>
      )}
      {!valid && <p>BAD LINK!</p>}
    </Box>
  );
};

export default ForgetPasswordToken;
