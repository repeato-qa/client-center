import { action, observable, makeObservable } from 'mobx';
import { getEnv } from '../../helpers/mobx-easy-wrapper';
import License from './models/license';

class DataStore {
  @observable
  licenseInfo?: License = undefined;

  constructor() {
    makeObservable(this);
  }

  async afterLoginEvents() {
    this.getLicenseInfo(false).catch(console.error);
  }

  @action
  setLicenseInfo = (info: License) => {
    this.licenseInfo = new License(info);
  };

  getLicenseInfo = async (refreshUser = true) => {
    try {
      const license = await getEnv().apiFactory.licenseService.getLicenseInfo();
      this.setLicenseInfo(license as License);
      let user = null;
      if (refreshUser)
        user = await getEnv().apiFactory.authService.getLoggedInUser();

      return { license, user };
    } catch (e) {
      console.log(e, 'Failed to get license info.');
      // throw e;
    }
  };

  linkLicenseWithUser = async (licenseKey: string) => {
    try {
      await getEnv().apiFactory.licenseService.linkLicenseWithUser(licenseKey);
      const result = await this.getLicenseInfo();
      return result;
    } catch (e) {
      console.log(e, 'Failed to link license.');
      throw e;
    }
  };
}

export default DataStore;
