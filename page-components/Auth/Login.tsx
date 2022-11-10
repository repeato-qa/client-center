import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useStore } from '@/lib/use-store';
import {
  Box,
  Avatar,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  Button,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { parseGetErrMsg, validate } from 'helpers/generic';
import './Auth.module.css';

const Login = () => {
  const router = useRouter();
  const { uiStore: { authStore, setAlert } = {} } = useStore();
  const rules: any = { email: 'email' };

  const [loginData, setLoginData] = React.useState({
    email: '',
    password: '',
  }) as any;
  const [errors, setErrors] = React.useState<any>({ email: '', password: '' });
  const [formSubmit, setFormSubmit] = React.useState(false);
  const [resendEmail, setResendEmail] = React.useState('');

  const validateField = (name: string, value: any) => {
    const error = validate(value, rules[name]);
    setErrors({ ...errors, [name]: value ? '' : error }); // in case of re-type hide the error again
    return error;
  };

  const onChange = (event: any) => {
    const { name, value } = event.target;
    setLoginData({ ...loginData, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormSubmit(true);
    let errors = { email: '', password: '' };
    Object.keys(loginData).forEach((key: string) => {
      // @ts-ignore
      errors[key] = validateField(key, loginData[key]);
    });

    const invalidForm = Object.values(errors).some((err) => !!err);
    if (invalidForm) {
      setErrors(errors);
      setFormSubmit(false);
      return false;
    }

    authStore
      .login(loginData.email, loginData.password)
      .then(() => router.push('/'))
      .catch((err: Error) => {
        setFormSubmit(false);
        setResendEmail(
          parseGetErrMsg(err)?.includes('not verified') ? loginData.email : ''
        );
        setErrors({ ...errors, email: parseGetErrMsg(err) });
      });
  };

  const handleReSend = () => {
    authStore
      .verifyEmail(resendEmail)
      .then(() => setAlert('Confirmation email sent again successfully.'))
      .catch((err: Error) =>
        setErrors({ ...errors, email: parseGetErrMsg(err) })
      );
    setResendEmail('');
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
        Sign in
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
          value={loginData.email}
          onChange={onChange}
        />
        {resendEmail && (
          <Button variant="outlined" onClick={handleReSend}>
            Resend Email
          </Button>
        )}
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
          value={loginData.password}
          onChange={onChange}
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" />}
          label="Remember me"
        />
        <Button
          disabled={formSubmit}
          type="submit"
          fullWidth
          variant="outlined"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            <Link href="forget-password">Forgot password?</Link>
          </Grid>
          <Grid item>
            <Link href="sign-up">{"Don't have an account? Sign Up"}</Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Login;
