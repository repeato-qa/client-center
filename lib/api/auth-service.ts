import { EmailConfirm, ResetPassword } from '../../types/auth';
import BaseService from '../core/base-service';
import StorageService, { StorageItems } from '../core/storage-service';
// import { config, crypt } from '../../helpers/generic';

export default class AuthService extends BaseService {
  static route = '/users';
  private storage: StorageService = new StorageService();

  storeCredentials(user: any) {
    this.storage.setItem(StorageItems.TOKEN, user.refreshToken);
  }

  clearCredentials() {
    this.storage.clearItem(StorageItems.TOKEN);
  }

  getCredentials(item: StorageItems) {
    return this.storage.getItem(item);
  }

  async getLoggedInUser() {
    const user = this.httpService.get('/user');

    return user;
  }

  // async loginWithToken(token: string) {
  //   const authenticatedUser = Object.values(app.allUsers).filter(
  //     (user) => user.isLoggedIn && user.refreshToken === token
  //   );

  //   if (!authenticatedUser.length) throw new Error('Token expired');
  //   app.switchUser(authenticatedUser[0]);
  //   await app.currentUser?.refreshCustomData(); // refresh user data

  //   return authenticatedUser[0];
  // }

  async login(email: string, password: string): Promise<any> {
    const user = await this.httpService.post('/auth', { email, password });

    return user;
  }

  async logout(): Promise<any> {
    await this.httpService.delete('/auth');

    return null;
  }

  async register(data: any): Promise<any> {
    const response = await this.httpService.post(this.path, data);

    return response;
  }

  async emailConfirm(args: EmailConfirm) {
    // const { token, tokenId, email } = args;
    // const response = await app.emailPasswordAuth.confirmUser({
    //   token,
    //   tokenId,
    // });
    // const updated = await this.httpService.updateOneAnon(
    //   this.dbCollection,
    //   { email },
    //   { $set: { id: tokenId, verified: true } }
    // );
    // await this.httpService.updateOneAnon(
    //   this.dbCollection,
    //   { email, invite: 'pending' },
    //   { $set: { invite: 'confirmed' } }
    // );

    console.log('[Auth][EmailConfirm]ToBeImplemented', args);
    return true;
  }

  async forgotPassword(email: string) {
    await this.httpService.post('/user/password/reset', { email });

    console.log('[Auth][ForgotPassword]', email);
    return true;
  }

  async resetPassword(args: ResetPassword) {
    await this.httpService.put('/user/password/reset', {
      password: args.password,
      token: args.token,
    });

    console.log('[Auth][ResetPassword]', args.token);
    return true;
  }

  async update({ firstName = '', lastName = '', company = '' }) {
    const user = await this.httpService.patch('/user', {
      firstName,
      lastName,
      company,
    });

    console.log('[Profile][Update]', user);
    return user;
  }

  async memberOfTeams(id: string, email: string) {
    const response = await this.httpService.post(`${this.path}/teams/members`, {
      id,
      email,
      type: 'fetch',
    });

    return response;
  }

  async memberExitTeam(email: string, managerId: string) {
    const response = await this.httpService.post(`${this.path}/teams/members`, {
      managerId,
      email,
      type: 'remove',
    });

    return response;
  }

  async teamMembersInfo() {
    const response = await this.httpService.get(`${this.path}/teams/members`);

    return response;
  }

  async sendInvite(email: string) {
    const response = await this.httpService.post(`${this.path}/invite`, {
      email,
    });

    return { invitedUser: response };
  }

  async removeMember(email: string, managerId: string) {
    const response = await this.httpService.post(`${this.path}/teams/members`, {
      managerId,
      email,
      type: 'remove',
    });

    return response;
  }

  async resendInvite(email: string) {
    console.log('[Resend]ToBeImplemented', email);
    // await app.emailPasswordAuth.retryCustomConfirmation({ email });
    return true;
  }

  async acceptTerms() {
    const response = await this.httpService.get('user/terms/accept');

    return response;
  }
}
