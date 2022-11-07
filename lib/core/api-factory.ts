import HttpService from './http-service';
import AuthService from '../api/auth-service';
import LicenseService from '../api/license-service';

const ApiList = [
  {
    variableName: 'authService',
    classEntity: AuthService,
    route: AuthService.route,
  },
  {
    variableName: 'licenseService',
    classEntity: LicenseService,
    route: LicenseService.route,
  },
];

export interface ApiFactoryParams {
  httpService: HttpService;
}

// declaration merging with class
interface ApiFactory {
  authService: AuthService;
  licenseService: LicenseService;
}

// eslint-disable-next-line no-redeclare
class ApiFactory {
  [index: string]: any; // eslint-disable-line no-undef

  constructor({ httpService }: ApiFactoryParams) {
    this.httpService = httpService;

    ApiList.forEach((route) => {
      this[route.variableName] = new route.classEntity({
        httpService,
        route: route.route,
      });
    });
  }

  saveToken(user: any) {
    this.httpService.setToken(user);
  }
}

export default ApiFactory;
