import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { observer } from 'mobx-react';
import { Button } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import { useStore } from '@/lib/use-store';
import styles from './Header.module.css';

interface Page {
  title: string;
  path?: string;
  onClick?: () => void;
  auth: boolean;
  role?: string;
}

const adminRole = 'admin';

const Header = () => {
  const router = useRouter();
  const { uiStore: { authStore } = {} } = useStore();

  const pages: Page[] = [
    { title: 'Admin', path: '/admin', auth: true, role: adminRole },
    { title: 'Account', path: '/', auth: true },
    // { title: 'Downloads', path: 'downloads', auth: true },
    {
      title: 'Logout',
      path: '/login',
      onClick: async () => await authStore.logout(),
      auth: true,
    },
    { title: 'Login', path: '/login', auth: false },
  ].filter(({ auth, role }) => {
    // user do not have required role then remove this page
    if (role && role !== authStore?.user?.role) {
      return false;
    }
    // auth user required but user is not logged in then remove this page
    if (auth && !authStore?.isLoggedIn) {
      return false;
    }
    // un-auth user required but user is logged in then remove this page
    if (!auth && authStore?.isLoggedIn) {
      return false;
    }
    return true;
  });

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = async (page: Page) => {
    if (page.onClick) {
      await page.onClick();
      if (page.path) router.push(page.path);
      return;
    } else {
      router.push(page.path);
    }
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" id={styles.topHeader}>
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <div style={{ position: 'relative' }}>
            <Link href="/" title="Home">
              <a>
                <Image
                  src="/repeato-logo.png"
                  alt="Repeato"
                  height={45}
                  width={165}
                  data-was-processed="true"
                />
              </a>
            </Link>
            <div
              style={{
                position: 'absolute',
                top: 30,
                left: 90,
                fontSize: 12,
                opacity: 0.9,
              }}
            >
              client&nbsp;center
            </div>
          </div>
          <Box
            sx={{
              justifyContent: 'flex-end',
              display: { xs: 'flex', md: 'none' },
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page, index) => (
                <MenuItem
                  key={(page.path || '') + index}
                  onClick={() => handleCloseNavMenu(page)}
                >
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 'auto' }}>
            {pages.map((page, index) => (
              <Button
                key={(page.path || '') + index}
                onClick={() => handleCloseNavMenu(page)}
                sx={{ my: 2, color: 'black', display: 'block' }}
              >
                {page.title}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default observer(Header);
