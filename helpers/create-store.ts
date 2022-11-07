import { wrapRoot } from 'mobx-easy';
import RootStore from '../stores/root-store';
import HttpService from '../lib/core/http-service';
import ApiFactory from '../lib/core/api-factory';

export interface Environment {
  api_end_point: string;
  repeato_app: string;
}

export interface RootEnv {
  envConfig: Environment;
  apiFactory: ApiFactory;
}

export interface CreateStoreResult {
  rootStore: RootStore;
  env: RootEnv;
}

export interface CreateStoreOptions {
  envConfig: Environment;
}

const createStore = ({ envConfig }: CreateStoreOptions): CreateStoreResult => {
  const httpService = new HttpService({ baseURL: envConfig.api_end_point });
  const apiFactory = new ApiFactory({ httpService });

  const env: RootEnv = {
    apiFactory,
    envConfig,
  };

  const rootStore = wrapRoot({ RootStore: RootStore, env });

  return {
    rootStore,
    env: {} as RootEnv,
  };
};

export default createStore;
