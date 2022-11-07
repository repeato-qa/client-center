import React from 'react';
import dayjs from 'dayjs';
import { Box, Container, Link, Typography } from '@mui/material';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: '#f9f9f9',
        borderTop: '1px solid #eee',
        marginTop: 10,
      }}
    >
      <Container maxWidth="lg" className={styles.footer}>
        <Typography
          variant="body2"
          color="text.secondary"
          component="div"
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <div>
            {'Copyright © '}Repeato {dayjs().year()}
          </div>

          <div>
            <Link
              href="https://www.repeato.app/imprint/"
              underline="hover"
              target="_blank"
            >
              Imprint
            </Link>{' '}
            |&nbsp;
            <Link
              href="https://www.repeato.app/terms-of-service/"
              underline="hover"
              target="_blank"
            >
              Terms &amp; Conditions
            </Link>{' '}
            |&nbsp;
            <Link
              href="https://www.repeato.app/privacy-policy/"
              underline="hover"
              target="_blank"
            >
              Privacy policy
            </Link>
          </div>
        </Typography>
      </Container>
    </Box>
  );
};

//  <span className="footer-text">
//         Reapeato Studio © {dayjs().year()}
//       </span>

export default Footer;
