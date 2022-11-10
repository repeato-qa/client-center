import React from 'react';
import { parseGetErrMsg, validate } from '@/helpers/generic';
import { useStore } from '@/lib/use-store';
import {
  Avatar,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const defaultSignUpValues = {
  firstName: '',
  email: '',
  password: '',
  company: '',
  invitedBy: undefined,
};

const SignUp = () => {
  const router = useRouter();
  const { uiStore: { authStore, setAlert } = {} } = useStore();
  const rules: any = {
    firstName: 'required|min:5|max:25',
    email: 'email',
    password: 'password',
  };
  const [signUpData, setSignUpData] = React.useState({
    ...defaultSignUpValues,
  }) as any;
  const [errors, setErrors] = React.useState({ ...defaultSignUpValues }) as any;
  const [formSubmit, setFormSubmit] = React.useState(false);
  const [termsAccept, setTermsAccept] = React.useState(false);
  const [optNewsLetter, setOptNewsLetter] = React.useState(false);

  const validateField = (name: string, value: string) => {
    const error = validate(value, rules[name]);
    setErrors({ ...errors, [name]: value ? '' : error }); // in case of re-type hide the error again
    return error;
  };

  const onChange = (event: any) => {
    const { name, value } = event.target;
    setSignUpData({ ...signUpData, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!termsAccept) {
      setAlert(
        'You must accept terms & conditions and privacy policy before signup.',
        'error'
      );
      return;
    }

    setFormSubmit(true);
    let errors = { ...defaultSignUpValues };
    Object.keys(signUpData).forEach((key) => {
      // @ts-ignore
      errors[key] = validateField(key, signUpData[key]);
    });

    const invalidForm = Object.values(errors).some((err) => !!err);
    if (invalidForm) {
      setErrors(errors);
      setFormSubmit(false);
      return false;
    }

    signUpData.optNewsLetter = optNewsLetter;
    signUpData.invitedBy = router.query.invitedBy || undefined;

    authStore
      .register(signUpData)
      .then(() => {
        if (!isInvited)
          setAlert('Please check your inbox for email confirmation.');
        else {
          setAlert('Signup completed - Logging you in...');
          router.push('/');
        }
        setSignUpData({ ...defaultSignUpValues });
      })
      .catch((err: Error) => {
        setErrors({ ...errors, email: parseGetErrMsg(err) });
      })
      .finally(() => setFormSubmit(false));
  };

  const isInvited = () => {
    const { invitedBy } = router.query;
    return !!invitedBy;
  };

  React.useEffect(() => {
    const { email = '', company = '' } = router.query;
    if (email) setSignUpData({ ...signUpData, email, company });
  }, [router.query]); // eslint-disable-line react-hooks/exhaustive-deps

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
        Sign up
      </Typography>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="given-name"
              name="firstName"
              required
              fullWidth
              id="firstName"
              label="First Name"
              autoFocus
              value={signUpData.firstName}
              helperText={errors.firstName}
              error={!!errors.firstName}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="company"
              label="Company"
              name="company"
              autoComplete="company"
              value={signUpData.company}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              disabled={!!isInvited()}
              label="Email Address"
              name="email"
              autoComplete="email"
              helperText={errors.email}
              error={!!errors.email}
              value={signUpData.email}
              onChange={onChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              helperText={errors.password}
              error={!!errors.password}
              value={signUpData.password}
              onChange={onChange}
            />

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
                  <Link href="https://www.repeato.app/terms-of-service/">
                    <a target="_blank">terms & conditions</a>
                  </Link>{' '}
                  and{' '}
                  <Link href="https://www.repeato.app/privacy-policy/">
                    <a target="_blank">privacy policy</a>
                  </Link>
                  .
                </Typography>
              }
            />
            <br />
            <FormControlLabel
              control={
                <Checkbox
                  checked={optNewsLetter}
                  onChange={() => setOptNewsLetter(!optNewsLetter)}
                />
              }
              label={
                <Typography>
                  I agree to receiving the product newsletter.
                </Typography>
              }
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="outlined"
          sx={{ mt: 3, mb: 2 }}
          disabled={formSubmit}
        >
          Sign Up
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link href="/login">Already have an account? Sign in</Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SignUp;
