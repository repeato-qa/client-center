import { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useRouter } from 'next/router';
import { useStore } from '@/lib/use-store';
import { Container, Box, ThemeProvider, Alert, Button } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import { LoadingDots } from '../LoadingDots';
import theme from '@/helpers/theme';

const Layout = ({ children }) => {
  const router = useRouter();
  const {
    uiStore: { authStore, hideAlert, showAlert },
  } = useStore();

  const [authorized, setAuthorized] = useState(false);

  const authCheck = async (url) => {
    await authStore.loginIfSessionActive();
    // redirect to login page if accessing a private page and not logged in
    const publicPaths = [
      '/login',
      '/sign-up',
      '/reset-password',
      '/confirm-email',
      '/set-password',
    ];
    const publicPartialMatch = ['/verify-email', '/forget-password'];
    const path = url.split('?')[0];
    if (
      !authStore.isLoggedIn &&
      !publicPaths.includes(path) &&
      !publicPartialMatch.some((match) => path.startsWith(match))
    ) {
      setAuthorized(false);
      router.push({
        pathname: '/login',
        query: { returnUrl: router.asPath },
      });
    } else {
      if (publicPaths.includes(path) && authStore.isLoggedIn) router.push('/');
      setAuthorized(true);
    }
  };

  useEffect(() => {
    authCheck(router.asPath); // on initial load - run auth check

    const hideContent = () => setAuthorized(false); // on route change start - hide page content by setting authorized to false
    router.events.on('routeChangeStart', hideContent);
    router.events.on('routeChangeComplete', authCheck); // on route change complete - run auth check

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header />
        <Container component="main" sx={{ mt: 8, mb: 2, flexGrow: 1 }}>
          {showAlert && (
            <Alert
              variant="filled"
              onClose={hideAlert}
              severity={showAlert?.type}
              action={
                showAlert?.action?.text && (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={showAlert.action.onClick}
                  >
                    {showAlert.action.text}
                  </Button>
                )
              }
            >
              {showAlert?.message}
            </Alert>
          )}
          {authorized ? children : <LoadingDots />}
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default observer(Layout);
