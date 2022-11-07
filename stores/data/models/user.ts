export default class User {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  id: string;
  company: string;
  license: string;
  verified: string;
  email: string;
  invite: string;
  inviteBy: string;
  role: 'admin' | 'user';
  acceptedTermsDate: string;
  managedUsers: string[];

  constructor(data: any) {
    Object.assign(this, data);
  }
}
