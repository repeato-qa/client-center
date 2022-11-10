import React from 'react';
import {
  Button,
  AppBar,
  Box,
  Grid,
  Tab,
  Tabs,
  TextField,
  Typography,
  TableContainer,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from '@mui/material';
import theme from '../../helpers/theme';
import { observer } from 'mobx-react';
import { useStore } from '@/lib/use-store';
import RootStore from '../../stores/root-store';
import { Remove } from '@mui/icons-material';
import User from '../../stores/data/models/user';
import styles from './Home.module.css';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.grey[700],
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      className="tabpanel"
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            // overflowX: 'auto',
            // maxHeight: '400px',
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
};

const Details = ({ rootStore }: { rootStore: RootStore }) => {
  const {
    uiStore: { authStore, setAlert },
    dataStore,
  } = rootStore;
  const { licenseInfo } = dataStore;

  const [formSubmit, setFormSubmit] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState(authStore.user || {}) as any;

  const onChange = (event: any) => {
    const { name, value } = event.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!userInfo.firstName /** || !userInfo.company **/) return;
    setFormSubmit(true);
    authStore
      .update({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        company: userInfo.company,
        id: authStore?.user?.id || '',
      })
      .then(() => setAlert('Profile info updated successfully!'))
      .finally(() => setFormSubmit(false));
  };

  const handleLicense = async () => {
    if (!userInfo.license) {
      setAlert('License key is not valid!', 'error');
      return;
    }
    setFormSubmit(true);

    dataStore
      .linkLicenseWithUser(userInfo.license)
      .then((response) => {
        setAlert('License verified successfully!');
        authStore.setUser(response?.user as any);
      })
      .catch((e) => setAlert(e.message, 'error'))
      .finally(() => setFormSubmit(false));
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            autoComplete="first-name"
            name="firstName"
            required
            fullWidth
            id="firstName"
            label="First Name"
            value={userInfo.firstName}
            error={!userInfo.firstName}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            autoComplete="last-name"
            name="lastName"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            value={userInfo.lastName}
            error={!userInfo.lastName}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            id="company"
            label="Company"
            name="company"
            autoComplete="company"
            value={userInfo.company}
            // error={!userInfo.company}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            disabled
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={userInfo.email}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            disabled={formSubmit}
            onClick={handleSubmit}
          >
            Update
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" component={'div'}>
            License Details:{' '}
          </Typography>

          {licenseInfo && (
            <>
              <br />
              <Typography>
                Max Androind Test Count:{' '}
                {licenseInfo?.licenseOptions?.maxTestCountAndroid || 10}
              </Typography>
              <Typography>
                Max iOS Test Count:{' '}
                {licenseInfo?.licenseOptions?.maxTestCountIos || 10}
              </Typography>
              <Typography>
                Max Steps Per Test:{' '}
                {licenseInfo?.licenseOptions?.maxStepsPerTest || 30}
              </Typography>
              <Typography>
                Workspaces Enabled:
                {licenseInfo?.licenseOptions?.workspacesEnabled
                  ? ' Yes'
                  : ' No'}
              </Typography>
              <Typography>
                Scheduler Supported:
                {licenseInfo?.licenseOptions?.schedulerSupported
                  ? ' Yes'
                  : ' No'}
              </Typography>
              <Typography>
                Batch Run Export Count:{' '}
                {licenseInfo?.licenseOptions?.batchRunExportCountMax || 10}
              </Typography>
              <Typography>
                Max Team Size: {licenseInfo?.maxManagedUsers || 0}
              </Typography>
            </>
          )}

          {!licenseInfo && <Typography>Loading...</Typography>}
        </Grid>
        <Grid item xs={8}>
          <TextField
            fullWidth
            name="license"
            label="License Key"
            id="license"
            value={userInfo.license || ''}
            onChange={onChange}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            type="submit"
            variant="outlined"
            disabled={formSubmit}
            onClick={handleLicense}
          >
            Validate License
          </Button>
          <Button
            variant="outlined"
            onClick={() =>
              window.open('https://www.repeato.app/pricing/', '_blank')
            }
            sx={{ ml: 1 }}
          >
            Buy License
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

const Members = ({
  rootStore,
}: // managers,
{
  rootStore: RootStore;
  // managers: User[];
}) => {
  const {
    uiStore: { authStore, setAlert },
    dataStore,
  } = rootStore;
  const { licenseInfo } = dataStore;

  const [invite, setInvite] = React.useState('') as any;
  const [inviteModal, setInviteModal] = React.useState(false);
  const [members, setMembers] = React.useState([] as User[]);
  const user = authStore.user as User;
  const limitReached =
    Number(licenseInfo?.maxManagedUsers || 0) <=
    (user?.managedUsers?.length || 0);

  const fetchMembers = () => {
    authStore
      .teamMembersInfo()
      .then((data) => setMembers(data as User[]))
      .catch(console.error);
  };

  const sendInvite = () => {
    if (!invite || !/\S+@\S+\.\S+/.test(invite)) return;
    const companyDomain = (email: string) => email.split('@')[1];

    if (companyDomain(invite) !== companyDomain(authStore.user?.email || '')) {
      setAlert(
        'Sorry, you can only invite team members of the same company. Please use different email or contact support',
        'error',
        {
          text: 'Contact Support',
          onClick: () => window.open('mailto:support@repeato.app'),
        }
      );
      setInviteModal(false); // to hide invite dialog again
      return;
    }

    if (limitReached) {
      const message = licenseInfo?.maxManagedUsers
        ? `You can not invite more than ${licenseInfo?.maxManagedUsers} to your team, please upgrade your account`
        : `Teams are not enabled for your account. Please upgrade.`;
      setAlert(message, 'error', {
        text: 'Upgrade',
        onClick: () =>
          window.open('https://www.repeato.app/pricing/', '_blank'),
      });
      setInviteModal(false); // to hide invite dialog again
      return;
    }

    if (invite === user.email) {
      setAlert('You cannot invite yourself.', 'error');
      setInviteModal(false); // to hide invite dialog again
      return;
    }

    if (members.find((member) => member.email === invite)) {
      setAlert('User is already part of your team.', 'error');
      setInviteModal(false); // to hide invite dialog again
      return;
    }

    authStore
      .sendInvite(invite)
      .then((invitedUser) => {
        setAlert(`User ${invite} has been invited to join the team.`);
        setMembers([...(members as User[]), invitedUser as User]);
      })
      .catch(console.error);
    setInviteModal(false); // to hide invite dialog again
    setInvite(''); // to reset invitation field
  };

  const handleRemoveMember = (id: string, email: string) => {
    authStore.removeMember(id, email).then(() => {
      setMembers(members.filter((member) => member.id !== id));
      setAlert(`Member ${email} removed successfully.`);
    });
  };

  const handleResendInvite = (email: string) => {
    authStore
      .verifyEmail(email)
      .then(() => setAlert(`Member ${email} re-invited successfully.`))
      .catch(() => setAlert('User already confirmed.', 'error'));
  };

  React.useEffect(() => {
    // get logged in user team members
    fetchMembers();
  }, []);

  return (
    <TableContainer sx={{ overflowX: 'inherit' }}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Email</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell align="right">Action/Status</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map((member) => (
            <StyledTableRow key={member?.email}>
              <StyledTableCell component="th" scope="row">
                {member?.email}
              </StyledTableCell>
              <StyledTableCell>
                {member?.firstName + (member?.lastName || '')}
              </StyledTableCell>
              <StyledTableCell align="right">
                {member?.invite === 'pending' && (
                  <>
                    <Button onClick={() => handleResendInvite(member?.email)}>
                      Resend Invitation
                    </Button>
                    <Button
                      onClick={() =>
                        handleRemoveMember(member?.id, member?.email)
                      }
                    >
                      Cancel Invitation
                    </Button>
                  </>
                )}
                {member?.invite !== 'pending' && (
                  <Button
                    onClick={() =>
                      handleRemoveMember(member?.id, member?.email)
                    }
                  >
                    Remove
                  </Button>
                )}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <br />
      <Button onClick={() => setInviteModal(true)} variant="outlined">
        Invite new member
      </Button>

      <Dialog open={inviteModal} fullWidth>
        <DialogTitle>Invite User</DialogTitle>
        <DialogContent>
          <TextField
            sx={{ mt: 1 }}
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={invite}
            onChange={(e) => setInvite(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInviteModal(false)}>Close</Button>
          <Button onClick={sendInvite}>Invite</Button>
        </DialogActions>
      </Dialog>
    </TableContainer>
  );
};

const Home = () => {
  const rootStore = useStore();
  const {
    uiStore: { authStore },
    // dataStore,
  } = rootStore;
  // const { licenseInfo } = dataStore;

  const [value, setValue] = React.useState(0);
  const [memberOfTeams, setMemberOfTeams] = React.useState([] as User[]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleExitTeam = async (manager: User) => {
    authStore
      .memberExitTeam(manager)
      .then(() => {
        const members = memberOfTeams.filter((user) => user.id !== manager.id);
        setMemberOfTeams(members);
        if (!members.length) setValue(0);
      })
      .catch(console.error);
  };

  React.useEffect(() => {
    // get logged in user team
    authStore
      .memberOfTeams()
      .then((data) => setMemberOfTeams(data || []))
      .catch(console.error);
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      className={styles.wrapper}
    >
      <Grid container>
        <Typography variant="h2" sx={{ p: 3 }}>
          Account
        </Typography>

        <AppBar position="static" sx={{ marginBottom: 2 }}>
          <Tabs
            value={value}
            onChange={handleChange}
            style={{ backgroundColor: '#fff' }}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
          >
            <Tab label="Details" {...a11yProps(0)} />

            <Tab label="Team Members" {...a11yProps(1)} />

            <Tab label="Team Memberships" {...a11yProps(2)} />
          </Tabs>
        </AppBar>

        <TabPanel value={value} index={0} dir={theme.direction}>
          <Details
            key={
              rootStore.dataStore.licenseInfo?.key + '-' + authStore.user?.id
            }
            rootStore={rootStore}
          />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Members rootStore={rootStore} /** managers={memberOfTeams} */ />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <List sx={{ bgcolor: 'background.paper' }}>
            {memberOfTeams.map((user) => {
              return (
                <ListItem
                  key={user.id}
                  sx={{
                    listStyle: 'disc outside none',
                    display: 'list-item',
                  }}
                >
                  <ListItemText primary={`${user.company} (${user.email})`} />
                  <ListItemButton onClick={() => handleExitTeam(user)}>
                    <Remove />
                    Exit Team
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          {memberOfTeams.length === 0 && (
            <Typography>You are currently not a member of any team.</Typography>
          )}
        </TabPanel>
      </Grid>
    </Box>
  );
};

export default observer(Home);
