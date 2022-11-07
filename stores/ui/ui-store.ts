import { action, makeObservable, observable } from 'mobx';
import AuthStore from './auth-store/auth-store';

class UiStore {
  @observable
  initialUrl?: string = '';
  @observable
  showAlert: { type: any; message: string; action?: any } | null = null;

  authStore: AuthStore = new AuthStore();

  constructor() {
    this.initialUrl = '/login';

    makeObservable(this);
  }

  @action
  setAlert = (message: string, type = 'success', action = {}) => {
    this.showAlert = { message, type, action }; // action.text & action.onClick
    setTimeout(this.hideAlert, 10000); // auto hide the alert after 10s
  };

  hideAlert = () => (this.showAlert = null);
}

export default UiStore;
