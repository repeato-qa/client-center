import React from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { ArrowDownward } from '@mui/icons-material';

const Downloads = () => {
  const [assets, setAssets] = React.useState<any>(null);

  const handleClick = (assetType: string) => {
    const downloadUrl = assets[assetType].browser_download_url;
    window.open(
      'https://www.repeato.app/documentation/getting-started/',
      '_blank'
    );
    window.open(downloadUrl);
  };

  React.useEffect(() => {
    fetch(
      'https://api.github.com/repos/stoefln/repeato-releases/releases/latest'
    )
      .then((res) => res.json())
      .then((json) => {
        const filteredAssets = {
          maxArm64: null,
          macX64: null,
          win: null,
          tagName: json.tag_name,
        };
        json.assets.forEach((asset: any) => {
          if (asset.name.endsWith('arm64.dmg')) {
            filteredAssets.maxArm64 = asset;
          }
          if (asset.name.endsWith('x64.dmg')) {
            filteredAssets.macX64 = asset;
          }
          if (asset.name.endsWith('.exe')) {
            filteredAssets.win = asset;
          }
        });

        setAssets(filteredAssets);
      });
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      className="wrapper"
    >
      <Typography variant="h3">Choose your version</Typography>
      <Grid container sx={{ p: 3 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid
              item
              textAlign="center"
              xs={4}
              sx={{ p: 2, borderRight: '1px solid' }}
            >
              <ArrowDownward />
              <Typography variant="h6">Reapto Studio</Typography>
              <Typography>Windows 7 and up</Typography>
              <Typography>Latest version:</Typography>
              <Typography>{assets?.tagName}</Typography>
              {assets && (
                <Button
                  variant="outlined"
                  onClick={() => handleClick('win')}
                  sx={{ mt: 2 }}
                >
                  Download
                </Button>
              )}
            </Grid>

            <Grid
              item
              xs={4}
              textAlign="center"
              sx={{ p: 2, borderRight: '1px solid' }}
            >
              <ArrowDownward />
              <Typography variant="h6">Reapto Studio for Mac OSX</Typography>
              <Typography>x64 architecture</Typography>
              <Typography>Latest version:</Typography>
              <Typography>{assets?.tagName}</Typography>
              {assets && (
                <Button
                  variant="outlined"
                  onClick={() => handleClick('macX64')}
                  sx={{ mt: 2 }}
                >
                  Download
                </Button>
              )}
            </Grid>

            <Grid item xs={4} textAlign="center" sx={{ p: 2 }}>
              <ArrowDownward />
              <Typography variant="h6">Reapto Studio for Mac OSX</Typography>
              <Typography>Apple Silicon</Typography>
              <Typography>Latest version:</Typography>
              <Typography>{assets?.tagName}</Typography>
              {assets && (
                <Button
                  variant="outlined"
                  onClick={() => handleClick('maxArm64')}
                  sx={{ mt: 2 }}
                >
                  Download
                </Button>
              )}
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Box>
  );
};

export default Downloads;
