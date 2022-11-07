import BaseService from '../core/base-service';

export default class LicenseService extends BaseService {
  static route = '/licenses';

  async getLicenseInfo() {
    const response = await this.httpService.get('/license');

    return response;
  }

  async linkLicenseWithUser(key: string) {
    const response = await this.httpService.patch('/license/attach', { key });

    return response;
  }
}
