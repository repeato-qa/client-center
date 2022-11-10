import React from 'react';
import { useRouter } from 'next/router';
import { Avatar, Box, Button, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useStore } from '@/lib/use-store';
import { parseGetErrMsg } from '@/helpers/generic';

const SetPassword = () => {
  const {
    uiStore: { authStore },
  } = useStore();
  const router = useRouter();

  // local states
  const [formSubmit, setFormSubmit] = React.useState(false);
  const [data, setData] = React.useState({} as any);
  const [errors, setErrors] = React.useState({} as any);

  // functions
  const onChange = (event: any) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
    if (value) setErrors({});
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { password, confirmPassword } = data;

    if (password.length < 8) {
      setErrors({ password: 'Password must be of minimum 8 characters' });
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Password does not match.' });
      return;
    }

    setFormSubmit(true);

    authStore
      .setPassword({ email: authStore.confirmedEmail, password } as any)
      .then(() => router.push('/login'))
      .catch((err: Error) => {
        setFormSubmit(false);
        setErrors({ password: parseGetErrMsg(err) });
      });
  };

  // Side effects
  React.useEffect(() => {
    if (!authStore.confirmedEmail) router.push('/login');
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
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Set Password
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="password"
          label="Password"
          name="password"
          autoFocus
          type="password"
          helperText={errors.password}
          error={!!errors.password}
          value={data.password || ''}
          onChange={onChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="confirmPassword"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          helperText={errors.confirmPassword}
          error={!!errors.confirmPassword}
          value={data.confirmPassword || ''}
          onChange={onChange}
        />

        <Button
          disabled={formSubmit}
          type="submit"
          fullWidth
          variant="outlined"
          sx={{ mt: 3, mb: 2 }}
        >
          Set Password
        </Button>
      </Box>
    </Box>
  );
};

export default SetPassword;
