import React from 'react';
import { Box, Grid, Link, Typography } from '@mui/material';

const dbLink =
  '  https://cloud.mongodb.com/v2/61c10e15fdf1705eda2db505#metrics/replicaSet/62ad9bc2fd2dc378cc9149cc/explorer/Repeato/Users/find';
const Admin = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      className="wrapper"
    >
      <Grid container>
        <Typography variant="h2" sx={{ pl: 3, pt: 3 }}>
          Admin
        </Typography>
        <Box sx={{ p: 3 }}>
          <Typography>
            <b> Database: </b>
            <Link href={dbLink} target="_blank">
              {dbLink}
            </Link>
          </Typography>
        </Box>
      </Grid>
    </Box>
  );
};

export default Admin;
