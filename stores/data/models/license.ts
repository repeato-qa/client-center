export default class License {
  key: string;
  description: string;
  multipleUsersAllowed: boolean;
  maxManagedUsers: number;
  userOwnLicense: boolean; // does user have own license or not (false if using manager's license) - needed for show/hide the invite functionality
  licenseOptions: {
    maxTestCountAndroid: number;
    maxTestCountIos: number | null;
    workspacesEnabled: boolean;
    schedulerSupported: boolean;
    batchRunExportCountMax: number;
    maxStepsPerTest: number;
  };

  constructor(data: any) {
    Object.assign(this, data);
  }
}
