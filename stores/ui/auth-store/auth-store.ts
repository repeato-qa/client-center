import { action, computed, makeObservable, observable } from 'mobx';
import { getEnv, getRoot } from '@/helpers/mobx-easy-wrapper';
import User from '../../data/models/user';
import { throwIf } from '@/helpers/generic';
import { ResetPassword } from '../../../types/auth';
// import { StorageItems } from '../../../lib/core/storage-service';

export enum AuthState {
  Authenticating = 'authenticating', // eslint-disable-line no-unused-vars
  LoggedIn = 'loggedIn', // eslint-disable-line no-unused-vars
  LoggedOut = 'loggedOut', // eslint-disable-line no-unused-vars
}

class AuthStore {
  @observable currentUser: User | null = null;
  @observable authState: AuthState = AuthState.LoggedOut;
  @observable confirmedEmail: string;

  constructor() {
    makeObservable(this);
  }

  async loginIfSessionActive(force = false) {
    try {
      if (this.isLoggedIn && !force) return; // user is already loggedIn
      this.setAuthState(AuthState.Authenticating);

      const result = await getEnv().apiFactory.authService.getLoggedInUser();

      if (result) await this.afterLoginEvents(result as User);
    } catch (e) {
      this.setAuthState(AuthState.LoggedOut);
      console.log(e, 'Failed to login from token');
    }
  }

  @action
  logout = async () => {
    const { apiFactory } = getEnv();

    apiFactory.authService.clearCredentials();
    await apiFactory.authService.logout();

    this.setUser(null);
    this.setAuthState(AuthState.LoggedOut);
    apiFactory.saveToken('');
  };

  @computed
  get user() {
    return this.currentUser;
  }

  @computed
  get isLoggedIn() {
    return this.authState === AuthState.LoggedIn;
  }

  @computed
  get isAdmin() {
    return this.authState === AuthState.LoggedIn && this.user?.role === 'admin';
  }

  @computed
  get isTermsAccepted() {
    return Boolean(this.user?.acceptedTermsDate);
  }

  @action
  setAuthState(authState: AuthState) {
    this.authState = authState;
  }

  @action
  setUser(user: User) {
    if (!user) {
      this.currentUser = null;
    } else {
      this.currentUser = new User(user);
    }
  }

  setConfirmedEmail = (email: string) => {
    this.confirmedEmail = email;
  };

  private async afterLoginEvents(user: User) {
    // const { apiFactory } = getEnv();
    const { dataStore } = getRoot();

    this.setUser(user);
    this.setAuthState(AuthState.LoggedIn);
    // if (user.token) {
    //   apiFactory.saveToken(user);
    //   apiFactory.authService.storeCredentials(user);
    // }

    // If you want to call events after related to the data after login
    await dataStore.afterLoginEvents();
  }

  refreshUser = async () => {
    const user = await getEnv().apiFactory.authService.getLoggedInUser();
    this.setUser(user as User);
  };

  login = async (email: string, password: string): Promise<any> => {
    try {
      this.setAuthState(AuthState.Authenticating);

      const result = await getEnv().apiFactory.authService.login(
        email,
        password
      );
      result.email = email; // email needed in after login hook

      await this.afterLoginEvents(result);
    } catch (e: any) {
      this.setAuthState(AuthState.LoggedOut);
      throwIf(
        e.message.includes('confirmation required'),
        'Email is not verified.'
      );
      throwIf(
        e.message.includes('invalid username'),
        'Invalid username or password is provided.'
      );
      console.log(e, 'Failed to login');
      throw e;
    }
  };

  register = async (data: any): Promise<any> => {
    try {
      this.setAuthState(AuthState.Authenticating);
      const result = await getEnv().apiFactory.authService.register(data);

      // await this.afterLoginEvents(result); // can be used for auto-login if confirmation disable
      return result;
    } catch (e: any) {
      this.setAuthState(AuthState.LoggedOut);
      throwIf(
        e.message.includes('name already in use'),
        'An account already exist with this email.'
      );
      console.log(e, 'Failed to register');
      throw e;
    }
  };

  forgotPassword = async (email: string) => {
    try {
      const result = await getEnv().apiFactory.authService.forgotPassword(
        email
      );

      return result;
    } catch (e: any) {
      console.log(e, 'Failed to send forgot password email');
      throwIf(
        e.message.includes('user not found'),
        'User not found, please provide valid account details.'
      );
      throw e;
    }
  };

  setPassword = async (args: ResetPassword) => {
    try {
      if (!args.email || !args.password) throw new Error('invalid');
      const result = await getEnv().apiFactory.authService.setPassword(args);
      return result;
    } catch (e: any) {
      console.log(e, 'Failed to set password');
      throw e;
    }
  };

  resetPassword = async (args: ResetPassword) => {
    try {
      if (!args.token || !args.password) throw new Error('invalid');
      const result = await getEnv().apiFactory.authService.resetPassword(args);

      return result;
    } catch (e: any) {
      console.log(e, 'Failed to reset password');
      throw e;
    }
  };

  update = async (args: {
    firstName: string;
    lastName: string;
    company: string;
    id: string;
  }) => {
    try {
      const result = await getEnv().apiFactory.authService.update(args);
      this.setUser(result as User); // set the updated data for user

      return result;
    } catch (e) {
      console.log(e, 'Failed to update profile');
      throw e;
    }
  };

  memberOfTeams = async () => {
    try {
      const result = await getEnv().apiFactory.authService.memberOfTeams(
        this.currentUser?.id || '',
        this.currentUser?.email || ''
      );

      return result as User[];
    } catch (e) {
      console.log(e, 'Failed to get member of teams data.');
    }
  };

  memberExitTeam = async (manager: User) => {
    try {
      const result = await getEnv().apiFactory.authService.memberExitTeam(
        this.user?.email || '',
        manager.id
      );

      return result;
    } catch (e) {
      console.log(e, 'Failed to exit team.');
    }
  };

  teamMembersInfo = async () => {
    try {
      const result = await getEnv().apiFactory.authService.teamMembersInfo();

      return result;
    } catch (e) {
      console.log(e, 'Failed to get team members.');
    }
  };

  sendInvite = async (email: string) => {
    try {
      const result = await getEnv().apiFactory.authService.sendInvite(email);
      this.refreshUser();

      return result.invitedUser;
    } catch (e) {
      console.log(e, 'Failed to invite team member.');
    }
  };

  removeMember = async (userToRemove: string, userEmail: string) => {
    try {
      const result = await getEnv().apiFactory.authService.removeMember(
        userEmail,
        this.user?.id || ''
      );
      this.refreshUser();

      return result;
    } catch (e) {
      console.log(e, 'Failed to remove team member.');
    }
  };

  verifyEmail = async (email: string) => {
    try {
      const result = await getEnv().apiFactory.authService.verifyEmail(email);

      return result;
    } catch (e) {
      console.log(e, 'Failed to resend invite.');
      throw e;
    }
  };

  acceptTerms = async () => {
    try {
      const result = await getEnv().apiFactory.authService.acceptTerms();
      this.refreshUser();

      return result;
    } catch (e) {
      console.log(e, 'Failed to accept terms.');
      throw e;
    }
  };
}

export default AuthStore;
