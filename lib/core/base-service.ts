import HttpService from './http-service';

export interface BaseResponse<T> {
  data: T;
}

interface BaseHttpServiceParams {
  route: string;
  httpService: HttpService;
}

class BaseService {
  static route: string = '';

  protected httpService: HttpService;
  private readonly route: string;

  constructor({ route, httpService }: BaseHttpServiceParams) {
    this.route = route;
    this.httpService = httpService;
  }

  protected get path() {
    return `${this.route}`;
  }
}

export default BaseService;
